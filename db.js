const mongoose = require('mongoose');

mongoose.connection
  .on('error', (error) => console.log(error))
  .on('close', () => console.log('Database connection closing...'))
  .once('open', () => {
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  });

module.exports = mongoose;
