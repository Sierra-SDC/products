const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/index.js');

const Products = sequelize.define('Products', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  slogan: {
    type: DataTypes.STRING(180),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(550),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  default_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Products.sync({ alter: true });

module.exports.Products = Products;
