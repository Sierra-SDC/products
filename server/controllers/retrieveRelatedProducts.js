const redisClient = require('../redis.js');
const { Related } = require('../models/index.js');

const DEFAULT_EXPIRATION = 3600;

const retrieveRelatedProducts = (req, res) => {
  let productId = req.params.product_id;
  redisClient.get(`related?product_id=${productId}`, (err, relatedProducts) => {
    if (err) console.log(err);
    if (relatedProducts !== null) {
      return res.status(200).json(JSON.parse(relatedProducts));
    } else {
      Related.findAll({
        where: {
          current_product_id: productId,
        },
      })
        .then((products) => {
          const relatedProducts = products.map((product) => {
            return product.related_product_id;
          });
          redisClient.setex(
            `related?product_id=${productId}`,
            DEFAULT_EXPIRATION,
            JSON.stringify(relatedProducts)
          );
          res.status(200).json(relatedProducts);
        })
        .catch((err) => res.status(400).json(err));
    }
  });
};

module.exports = retrieveRelatedProducts;
