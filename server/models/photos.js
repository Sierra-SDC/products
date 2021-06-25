const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/index.js');

const Photos = sequelize.define('photos', {
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
  url: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  thumbnail_url: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
});

// Photos.sync({ alter: true });

module.exports.Photos = Photos;
