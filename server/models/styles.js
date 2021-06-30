const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/index.js');
const { Photos } = require('./photos.js');
const { Skus } = require('./skus.js');

const Styles = sequelize.define(
  'styles',
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
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    sale_price: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    original_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    default_style: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

Styles.hasMany(Photos, {
  foreignKey: 'styleId',
  constraints: false,
});

Photos.belongsTo(Styles, {
  foreignKey: 'id',
  constraints: false,
});

Styles.hasMany(Skus, {
  foreignKey: 'styleId',
  constraints: false,
});

Skus.belongsTo(Styles, {
  foreignKey: 'id',
  constraints: false,
});

Styles.sync({ alter: true });

module.exports.Styles = Styles;
