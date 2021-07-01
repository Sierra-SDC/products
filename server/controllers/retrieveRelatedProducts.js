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
        .then((results) => {
          redisClient.setex(
            `related?product_id=${productId}`,
            DEFAULT_EXPIRATION,
            JSON.stringify(results)
          );
          res.status(200).json(
            results.map((result) => {
              return result.related_product_id;
            })
          );
        })
        .catch((err) => res.status(400).json(err));
    }
  });
};

module.exports = retrieveRelatedProducts;
