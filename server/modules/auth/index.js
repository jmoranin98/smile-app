const router = require('express').Router();
const database = require('../../database');
const {
  validatePassword,
  generateHashedPassword,
} = require('../../utils/bcrypt');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const userFound = await database.select('*')
    .from('users')
    .where('username', username)
    .first();

  if (!userFound) return res.status(400).end();

  const matchPassword = await validatePassword(password, userFound.password);
  if (!matchPassword) return res.status(401).end();

  return res.send({ user: userFound });
});

router.post('/signup', async (req, res) => {
  const { user } = req.body;

  delete user.id;
  const hashedPassword = await generateHashedPassword(user.password);

  try {
    await database('users')
      .insert({
        ...user,
        password: hashedPassword,
      })
      .returning('*');
  } catch (error) {
    return res.status(500).end();
  }

  return res.status(201).end();
});

module.exports = router;
