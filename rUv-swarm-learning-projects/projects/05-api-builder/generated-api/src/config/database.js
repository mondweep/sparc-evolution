
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_URL || 'database.sqlite',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

module.exports = { sequelize };
