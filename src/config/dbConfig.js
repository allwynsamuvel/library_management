// User define DB Creadentials
// const dbCredentials = require('./config').db;`
const database = process.env.DATABASE_DRIVER || 'mongodb';

if (database.toLowerCase() === 'mongodb') {

  //Bring in the mongoose module
  const mongoose = require('mongoose');
  // const { url, name } = dbCredentials.noSqlDbConfig;
  const dbURI = "mongodb+srv://allwynaxioned:Admin@cluster0.ccu5s.mongodb.net/librarydb?retryWrites=true&w=majority";

  //console to check what is the dbURI refers to
  console.log('Database URL is => ', dbURI);

  //Open the mongoose connection to the database
  mongoose.connect(dbURI, {
    config: {
      autoIndex: true,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Db Connection
  let db = mongoose.connection;

  db.on('connected', () => {
    console.log('Mongoose connected to ' + dbURI);
  });

  db.on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
  });

  db.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });

  process.on('SIGINT', () => {
    db.close(() => {
      console.log('Mongoose disconnected through app termination');
      process.exit(0);
    });
  });

  //Exported the database connection to be imported at the server
  exports.default = db;
} else {
  console.log(
    '\x1b[33m%s\x1b[0m',
    '-> Application is running without database connection!'
  );
}
