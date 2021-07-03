const sequelize = require('../../db/index.js');
const redisClient = require('../redis.js');
const { QueryTypes } = require('sequelize');

const DEFAULT_EXPIRATION = 3600;

const retrieveProductStyles = (req, res) => {
  let productId = req.params.product_id;
  redisClient.get(`styles?product_id=${productId}`, (err, styles) => {
    if (err) console.log(err);
    if (styles !== null) {
      return res.status(200).json(JSON.parse(styles));
    } else {
      let query = `SELECT
      styles.id AS "style_id",
      styles.name,
      styles.original_price,
      styles.sale_price,
      styles.default_style AS "default?",
      (
        SELECT jsonb_agg(jsonb_build_object(
          'thumbnail_url', photos.thumbnail_url,
          'url', photos.url
          )) AS photos
        FROM photos
        WHERE styles.id = photos.style_id
      ),
      (
        SELECT jsonb_agg(jsonb_build_object(
          'id', skus.id,
          'quantity', skus.quantity,
          'size', skus.size
        )) AS skus
        FROM skus
        WHERE styles.id = skus.style_id
      )
      FROM styles
      WHERE styles.product_id = ${req.params.product_id};`;

      sequelize
        .query(query, {
          plain: false,
          raw: true,
          type: QueryTypes.SELECT,
        })
        .then((results) => {
          let styles = results.map((style) => {
            if (style.sale_price === 'null') {
              style.sale_price = '0';
            }
            style['default?'] === 0
              ? (style['default?'] = true)
              : (style['default?'] = false);
            let obj = {};
            for (let i = 0; i < style['skus'].length; i++) {
              let sku = style['skus'][i];
              obj[sku['id']] = {
                quantity: sku['quantity'],
                size: sku['size'],
              };
            }
            style['skus'] = obj;
            return style;
          });

          let response = {
            product_id: req.params.product_id,
            results: styles,
          };
          redisClient.setex(
            `styles?product_id=${productId}`,
            DEFAULT_EXPIRATION,
            JSON.stringify(response)
          );
          res.status(200).json(response);
        })
        .catch((err) => {
          res.status(404).json(err);
        });
    }
  });
};

module.exports = retrieveProductStyles;
