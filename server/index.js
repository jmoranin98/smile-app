const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const {
  SERVER_PORT,
  LOGGER,
} = require('./config');
const authRouter = require('./modules/auth');
const appointmentsRouter = require('./modules/appointments');
const notificationsRouter = require('./modules/notifications');
const usersRouter = require('./modules/users');
const materialsRouter = require('./modules/materials');

const app = express();

app.use(cors());
app.use(morgan(LOGGER));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/appointments', appointmentsRouter);
app.use('/notifications', notificationsRouter);
app.use('/users', usersRouter);
app.use('/materials', materialsRouter);

app.listen(SERVER_PORT, () => console.log(`Server listening on port ${SERVER_PORT}`));
