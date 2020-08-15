const keys = require('./keys');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const controller = require('./controller')

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = keys.node_port || 8080;

app.use('/', controller);

app.listen(port, (err) => {
  console.log(`Server listening at port ${port}`);
});
