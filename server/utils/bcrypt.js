const bcrypt = require('bcrypt');

const generateHashedPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

const validatePassword = async (password, hash) => {
  const res = await bcrypt.compare(password, hash);
  return res;
};

module.exports = {
  generateHashedPassword,
  validatePassword,
};
