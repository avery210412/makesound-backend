require('dotenv').config();

const express = require('express');
const createError = require('http-errors');
const errorHandler = require('./middlewares/errorHandler');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const songRoutes = require('./routes/songs');

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/songs', express.static(__dirname + '/songs'));

app.use('/users', userRoutes);
app.use('/songs', songRoutes);

app.use('/*', (req, res, next) => next(createError(404)));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`);
});
