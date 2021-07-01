const { Op, QueryTypes } = require('sequelize');
const {
  Products,
  Styles,
  Features,
  Related,
  Photos,
  Skus,
} = require('../models/index.js');
const { sequelize } = require('../../db/index.js');
const Redis = require('redis');

const redisClient = Redis.createClient({ url: process.env.SERVERHOST });
const DEFAULT_EXPIRATION = 3600;

module.exports = {
  retrieveProducts: (req, res) => {
    let queryCount = req.query.count;
    let pageCount = req.query.page;
    if (queryCount) {
      redisClient.get(`allProductsByCount?=${queryCount}`, (err, products) => {
        if (err) console.log(err);
        if (products !== null) {
          console.log('cache hit');
          return res.status(200).json(JSON.parse(products));
        } else {
          Products.findAll({
            limit: queryCount,
          })
            .then((products) => {
              console.log('cache missed');
              redisClient.setex(
                `allProductsByCount?=${queryCount}`,
                DEFAULT_EXPIRATION,
                JSON.stringify(products)
              );
              res.status(200).json(products);
            })
            .catch((err) => res.json(err));
        }
      });
    } else if (pageCount) {
      let end = pageCount * 5;
      redisClient.get(`allProductsByPage?=${pageCount}`, (err, products) => {
        if (err) console.log(err);
        if (products !== null) {
          console.log('cache hit');
          res.status(200).json(JSON.parse(products));
        } else {
          Products.findAll({
            where: {
              id: {
                [Op.between]: [end - 4, end],
              },
            },
          })
            .then((products) => {
              console.log('cache missed');
              redisClient.setex(
                `allProductsByPage?${pageCount}`,
                DEFAULT_EXPIRATION,
                JSON.stringify(products)
              );
              res.status(200).json(products);
            })
            .catch((err) => res.status(404).json(err));
        }
      });
    } else {
      Products.findAll({
        where: {
          id: {
            [Op.between]: [0, 5],
          },
        },
      })
        .then((results) => res.status(200).json(results))
        .catch((err) => res.status(404).json(err));
    }
  },
  retrieveProduct: (req, res) => {
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
  },
  retrieveProductStyles: (req, res) => {
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
  },
  retrieveRelatedProducts: (req, res) => {
    let productId = req.params.product_id;
    redisClient.get(
      `related?product_id=${productId}`,
      (err, relatedProducts) => {
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
      }
    );
  },
};
