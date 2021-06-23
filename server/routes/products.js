const productsRouter = require('express').Router();
const {
  retrieveProducts,
  retrieveProduct,
  retrieveProductStyles,
  retrieveRelatedProducts,
} = require('../controllers/index.js');

productsRouter.route('/').get(retrieveProducts);

productsRouter.route('/:product_id').get(retrieveProduct);

productsRouter.route('/:product_id/styles').get(retrieveProductStyles);

productsRouter.route('/:product_id/related').get(retrieveRelatedProducts);

module.exports.productsRouter = productsRouter;
