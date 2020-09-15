const config = {
  SERVER_PORT: process.env.SERVER_PORT || 8080,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || 'smileapp',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'admin',
  LOGGER: process.env.LOGGER || 'combined',
  AMQP_HOST: process.env.AMQP_HOST || 'localhost',
  AMQP_PORT: process.env.AMQP_PORT || '5672',
};

module.exports = config;
