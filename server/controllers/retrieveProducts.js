const { Products } = require('../models/index.js');
const { Op } = require('sequelize');
const redisClient = require('../redis.js');

const DEFAULT_EXPIRATION = 3600;

const retrieveProducts = (req, res) => {
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
};

module.exports = retrieveProducts;
