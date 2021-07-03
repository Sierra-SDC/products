const { DataTypes } = require('sequelize');
const sequelize = require('../../db/index.js');

const Skus = sequelize.define(
  'skus',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    style_id: {
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
  },
  {
    indexes: [
      {
        unique: false,
        fields: ['style_id'],
      },
    ],
  }
);

Skus.sync({ alter: true });

module.exports = Skus;
