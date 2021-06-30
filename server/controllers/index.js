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

module.exports = {
  retrieveProducts: (req, res) => {
    if (req.query.count) {
      Products.findAll({
        limit: req.query.count,
      })
        .then((results) => res.status(200).json(results))
        .catch((err) => res.json(err));
    } else if (req.query.page) {
      let end = req.query.page * 5;
      Products.findAll({
        where: {
          id: {
            [Op.between]: [end - 4, end],
          },
        },
      })
        .then((results) => res.status(200).json(results))
        .catch((err) => res.json(err));
    } else {
      Products.findAll({
        where: {
          id: {
            [Op.between]: [0, 5],
          },
        },
      })
        .then((results) => res.status(200).json(results))
        .catch((err) => res.json(err));
    }
  },
  retrieveProduct: (req, res) => {
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
    WHERE products.id = 11002;
  `;
    sequelize
      .query(query, {
        plain: false,
        raw: true,
        type: QueryTypes.SELECT,
      })
      .then((results) => res.status(200).json(results))
      .catch((err) => res.status(400).json(err));
  },
  retrieveProductStyles: (req, res) => {
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

        res.json(response);
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  },
  retrieveRelatedProducts: (req, res) => {
    Related.findAll({
      where: {
        current_product_id: req.params.product_id,
      },
    })
      .then((results) => {
        res.status(200).json(
          results.map((result) => {
            return result.related_product_id;
          })
        );
      })
      .catch((err) => res.status(400).json(err));
  },
};
