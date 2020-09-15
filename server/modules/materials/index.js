const router = require('express').Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  const { data } = await axios('https://sisprov-backend.herokuapp.com/producto/listarinfo');
  return res.send(data);
});

module.exports = router;
