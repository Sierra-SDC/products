require('dotenv').config();
const { Pool } = require('pg');
const { Sequelize } = require('sequelize');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || '0.0.0.0',
  database: process.env.PGDATABASE || 'postgres',
  password: process.env.PGPASSWORD || '',
  port: process.env.PGPORT || '5432',
});

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  pool.end();
});

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres',
    define: {
      timestamps: false,
    },
  }
);

sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch((error) => console.error('Unable to connect to the database:', error));

module.exports = sequelize;
