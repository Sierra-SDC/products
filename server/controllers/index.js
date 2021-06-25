const { Op } = require('sequelize');
const {
  Products,
  Styles,
  Features,
  Related,
  Photos,
  Skus,
} = require('../models/index.js');

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
      Products.findAll()
        .then((results) => res.status(200).json(results))
        .catch((err) => res.json(err));
    }
  },
  retrieveProduct: (req, res) => {
    Products.findOne({
      where: { id: req.params.product_id },
      include: [
        {
          model: Features,
          attributes: { exclude: '$product_id$' },
        },
      ],
    })
      .then((results) => res.status(200).json(results))
      .catch((err) => res.status(400).json(err));
  },
  retrieveProductStyles: (req, res) => {
    Styles.findAll({
      where: {
        productId: req.params.product_id,
      },
      include: [
        {
          model: Photos,
          raw: true,
          attributes: {
            exclude: ['id', 'styleId'],
          },
        },
        {
          model: Skus,
          raw: true,
          attributes: {
            exclude: ['styleId'],
          },
        },
      ],
    })
      .then((results) => {
        let styles = results.map((style) => {
          let {
            id,
            name,
            sale_price,
            original_price,
            default_style,
            photos,
            skus,
          } = style;

          if (sale_price === 'null') {
            sale_price = '0';
          }
          default_style === 0
            ? (default_style = true)
            : (default_style = false);

          let obj = {};
          for (let i = 0; i < skus.length; i++) {
            let sku = skus[i];
            obj[sku['id']] = {
              quantity: sku['quantity'],
              size: sku['size'],
            };
          }

          return {
            style_id: id,
            name: name,
            original_price: original_price,
            sale_price: sale_price,
            'default?': default_style,
            photos,
            skus: obj,
          };
        });

        let response = {
          product_id: req.params.product_id,
          results: styles,
        };

        res.status(200).json(response);
      })
      .catch((err) => res.status(400).json(err));
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
