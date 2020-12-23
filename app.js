require('dotenv').config();

const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('./db');

const router = require('./router');

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/token', router);
const server = app.listen(PORT, () => {
  console.log(`Server listening at localhost: ${PORT}`);
});

app.use((req, res, next) => {
  res
    .status(404)
    .json({ error: '404. Sorry we can find this route. Try again' });
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal recieved');
  console.log('Closing HTTP server');
  server.close(() => {
    console.log('HTTP Server closed');

    mongoose.connection.close(false, () => {
      console.log('MongoDB connection close');
    });
  });
});
