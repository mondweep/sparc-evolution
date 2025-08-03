
const { request, app } = require('./setup');

describe('User Endpoints', () => {
  let authToken;
  let userId;

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body).toHaveProperty('token');

      authToken = response.body.token;
      userId = response.body.user.id;
    });

    it('should not create user with invalid email', async () => {
      const userData = {
        username: 'testuser2',
        email: 'invalid-email',
        password: 'password123'
      };

      await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(400);
    });
  });

  describe('GET /api/v1/users', () => {
    it('should get all users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/v1/users')
        .expect(401);
    });
  });
});
