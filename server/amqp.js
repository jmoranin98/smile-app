const amqp = require('amqplib/callback_api');
const {
  AMQP_HOST,
  AMQP_PORT,
} = require('./config');

let channel;

const getChannel = async () => {
  if (channel !== undefined) return Promise.resolve(channel);
  else {
    return new Promise((resolve, reject) => {
      amqp.connect(`amqp://${AMQP_HOST}:${AMQP_PORT}`, (err, conn) => {
        if (err) reject(err);
        conn.createChannel((err, cha) => {
          if (err) throw new Error(err);
          console.log(`Connected to RabbitMQ`);
          channel = cha;
          resolve(cha);
        });
      });
    });
  }
};

const addConsumer = async (queue, fn) => {
  const channel = await getChannel();
  channel.assertQueue(queue, { durable: true });
  channel.consume(queue, message => fn(JSON.parse(message.content.toString())), { noAck: true });
};

const publishMessage = async (queue, message) => {
  console.log(`Sending message to ${queue}`);
  const channel = await getChannel();
  channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
};

module.exports = {
  addConsumer,
  publishMessage,
};
