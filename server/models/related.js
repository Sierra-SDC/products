const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/index.js');

const Related = sequelize.define(
  'related',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    current_product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    related_product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        unique: false,
        fields: ['current_product_id'],
      },
    ],
  }
);

Related.sync({ alter: true });

module.exports.Related = Related;
