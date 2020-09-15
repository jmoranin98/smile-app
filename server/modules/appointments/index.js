const router = require('express').Router();
const database = require('../../database');
const {
  publishMessage,
  addConsumer,
} = require('../../amqp');
const { onBudgetRequestCompleted } = require('./listeners');
const moment = require('moment');
const { route } = require('../users');

addConsumer('proforma', onBudgetRequestCompleted);

router.get('/', async (req, res) => {
  const { clientId, doctorId } = req.query;

  let filters = {};
  if (doctorId) filters = {...filters, doctorId};
  if (clientId) filters = {...filters, clientId};

  const appointments = await database.select([
    'appointments.*',
    'd.firstName as doctorFirstName',
    'd.lastName as doctorLastName',
    'c.firstName as clientFirstName',
    'c.lastName as clientLastName',
  ])
    .from('appointments')
    .innerJoin('users as d', 'd.id', 'doctorId')
    .innerJoin('users as c', 'c.id', 'clientId')
    .where(filters);

  return res.send({ appointments });
});

router.get('/:id/budget', async (req, res) => {
  const { id } = req.params;

  const materials = await database.select('*')
    .from('materials')
    .where('appointmentId', id);

  return res.send({ materials });
});

router.get('/next', async (req, res) => {
  const { clientId, doctorId } = req.query;

  let filters = {};
  if (doctorId) filters = {...filters, doctorId};
  if (clientId) filters = {...filters, clientId};

  const appointments = await database.select([
    'appointments.*',
    'd.firstName as doctorFirstName',
    'd.lastName as doctorLastName',
    'c.firstName as clientFirstName',
    'c.lastName as clientLastName',
  ])
    .from('appointments')
    .innerJoin('users as d', 'd.id', 'doctorId')
    .innerJoin('users as c', 'c.id', 'clientId')
    .where(filters)
    .whereRaw('"appointments"."startDate" > NOW()')
    .orderBy('appointments.startDate')
    .limit(5);

  return res.send({ appointments });
});

router.get('/history', async (req, res) => {
  const { clientId, doctorId } = req.query;

  let filters = {};
  if (doctorId) filters = {...filters, doctorId};
  if (clientId) filters = {...filters, clientId};

  const appointments = await database.select([
    'appointments.*',
    'd.firstName as doctorFirstName',
    'd.lastName as doctorLastName',
    'c.firstName as clientFirstName',
    'c.lastName as clientLastName',
  ])
    .from('appointments')
    .innerJoin('users as d', 'd.id', 'doctorId')
    .innerJoin('users as c', 'c.id', 'clientId')
    .where(filters)
    .whereRaw('"appointments"."startDate" < NOW()')
    .orderBy('appointments.startDate')
    .limit(10);

  return res.send({ appointments });
});

router.post('/', async (req, res) => {
  const { appointment } = req.body;

  delete appointment.id;
  const [ appointmentCreated ] = await database('appointments')
    .insert({
      ...appointment,
      status: 'pending',
      endDate: moment(appointment.startDate).add('1', 'day').toDate(),
    })
    .returning('*');

  return res.send({ appointment: appointmentCreated });
});

router.put('/:id', async (req, res) => {
  const { appointment, items } = req.body;
  const { id } = req.params;

  delete appointment.id;
  const [ appointmentUpdated ] = await database('appointments')
    .where('id', id)
    .update(appointment)
    .returning('*');

  if (
    appointment.status === 'confirmed' &&
    items && items.length !== 0
  ) {
    const newItems = items.map(item => ({
      ...item,
      appointmentId: id,
    }));
    publishMessage('request', newItems);
  }

  return res.send({ appointment: appointmentUpdated });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await database('appointments')
    .where('id', id)
    .del();

  return res.status(200).end();
});

module.exports = router;
