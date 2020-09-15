const router = require('express').Router();
const database = require('../../database');

router.get('/', async (req, res) => {
  const { role } = req.query;

  let filters = {};
  if (role) filters = { ...filters, role };

  const users = await database.select([
    'users.id',
    'users.firstName',
    'users.lastName',
    'users.address',
    'users.age',
    'users.email',
    'users.role',
    'users.username',
    'users.documentNumber',
  ])
    .from('users')
    .where(filters);

  return res.send({ users });
});

module.exports = router;
