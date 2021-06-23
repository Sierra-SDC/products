const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/index.js');

const Styles = sequelize.define('Styles', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  sale_price: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  original_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  default_style: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Styles.sync({ alter: true });

module.exports.Styles = Styles;
