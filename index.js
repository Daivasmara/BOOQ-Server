/* eslint-disable no-console */
const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const morgan = require('morgan');
const { connect, connection } = require('mongoose');
const schema = require('./schema');

const app = express();

const { PORT } = process.env;

// middlewares
app.use(cors());
app.use(morgan('dev'));

// db connection
connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
}).catch((error) => console.log(error));
connection.once('open', () => console.log('Connected to database!'));

// listening port
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

// routes
app.get('/', (req, res) => {
  res.status(200);
  res.json({
    message: 'Welcome to BOOQ API',
  })
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
