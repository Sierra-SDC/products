const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/index.js');

const Features = sequelize.define(
  'features',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    feature: {
      type: DataTypes.STRING(35),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(70),
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ['product_id'],
      },
    ],
  }
);

// Features.sync({ alter: true });

module.exports.Features = Features;
