const keys = require('./keys');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const controller = require('./controller');
const Passport = require('./passport');

const app = express();
app.use(cors({
  origin: 'http://client:3000'
}));
app.use(bodyParser.json());

const port = keys.node_port || 8080;

app.use('/', controller);

app.listen(port, async (err) => {
  await Passport.init();
  console.log(`Server listening at port ${port}`);
});
