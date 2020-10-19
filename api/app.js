const keys = require('./keys');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const controller = require('./controller');
const Passport = require('./passport');

const app = express();
app.use(cookieParser());

app.use(cors());

app.use(bodyParser.json());

const port = keys.node_port || 8080;

app.use('/api', controller);

app.listen(port, "0.0.0.0", async (err) => {
  await Passport.init();
  console.log(`Server listening at port ${port}`);
});
