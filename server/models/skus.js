const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/index.js');

const Skus = sequelize.define('Skus', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  styleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Skus.sync({ alter: true });

module.exports.Skus = Skus;
