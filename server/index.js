const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const { productsRouter } = require('./routes/products.js');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/products', productsRouter);

app.get('/', (req, res) =>
  res.send('Welcome to our backend Products API service')
);

app.get(`/${process.env.LOADER}`, (req, res) =>
  res.send(`${process.env.LOADER}`)
);

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
