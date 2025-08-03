
const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../src/config/database');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

module.exports = { request, app };
