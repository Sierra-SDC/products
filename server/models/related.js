const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/index.js');

const Related = sequelize.define('Related', {
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
});

Related.sync({ alter: true });

module.exports.Related = Related;
