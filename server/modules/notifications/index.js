const router = require('express').Router();
const database = require('../../database');

router.get('/', async (req, res) => {
  const { userId } = req.query;

  if (!userId) return res.status(400).end();
  const notifications = await database.select('*')
    .from('notifications')
    .where('userId', userId);

  return res.send({ notifications });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const [ notificationUpdated ] = await database('notifications')
    .where('id', id)
    .update('seems', true)
    .returning('*');

  return res.send({ notification: notificationUpdated });
});

module.exports = router;
