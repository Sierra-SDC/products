const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../db/index.js');
const redisClient = require('../redis.js');

const DEFAULT_EXPIRATION = 3600;

const retrieveProduct = (req, res) => {
  let productId = req.params.product_id;
  redisClient.get(`product?product_id=${productId}`, (err, product) => {
    if (err) console.log(err);
    if (product !== null) {
      return res.status(200).json(JSON.parse(product));
    } else {
      let query = `
        SELECT
          products.id,
          products.name,
          products.slogan,
          products.description,
          products.category,
          products.default_price,
        (
          SELECT jsonb_agg(jsonb_build_object(
            'feature', features.feature,
            'value', features.value
            )) AS features
          FROM features
          WHERE products.id = features.product_id
        )
        FROM products
        WHERE products.id = ${productId};
      `;
      sequelize
        .query(query, {
          plain: false,
          raw: true,
          type: QueryTypes.SELECT,
        })
        .then((results) => {
          redisClient.setex(
            `product?product_id=${productId}`,
            DEFAULT_EXPIRATION,
            JSON.stringify(results)
          );
          res.status(200).json(results);
        })
        .catch((err) => res.status(400).json(err));
    }
  });
};

module.exports = retrieveProduct;
