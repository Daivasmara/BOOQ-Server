const express = require('express');
const graphqlHTTP = require('express-graphql');
const { connect, connection } = require('mongoose');
const schema = require('./schema');

const app = express();

const PORT = process.env.PORT || 5000;

connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
}).catch(error => console.log(error));

connection.once('open', () => {
  console.log('Connected to database!')
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
});


app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Welcome to BOOQ API'
  })
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));
