const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const { connectDB, disconnectDB } = require('../../config/db');

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('User Registration and Login Flow', () => {
    it('should register, login, and get user profile', async () => {
      // Register
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Integration Test',
          email: 'integration@test.com',
          password: 'password123',
          role: 'patient'
        });

      expect(registerRes.statusCode).toEqual(201);
      expect(registerRes.body).toHaveProperty('token');

      // Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'integration@test.com',
          password: 'password123'
        });

      expect(loginRes.statusCode).toEqual(200);
      const token = loginRes.body.token;

      // Get profile
      const profileRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(profileRes.statusCode).toEqual(200);
      expect(profileRes.body.user.email).toEqual('integration@test.com');
    });
  });

  describe('Password Reset Flow', () => {
    it('should handle forgot password and reset', async () => {
      // Create user
      await User.create({
        name: 'Password Reset',
        email: 'reset@test.com',
        password: 'password123',
        role: 'patient'
      });

      // Forgot password
      const forgotRes = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'reset@test.com' });

      expect(forgotRes.statusCode).toEqual(200);

      // Get reset token from DB
      const user = await User.findOne({ email: 'reset@test.com' });
      const resetToken = user.getResetPasswordToken();
      await user.save();

      // Reset password
      const resetRes = await request(app)
        .put(`/api/auth/reset-password/${resetToken}`)
        .send({ password: 'newpassword123' });

      expect(resetRes.statusCode).toEqual(200);

      // Verify new password works
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'reset@test.com',
          password: 'newpassword123'
        });

      expect(loginRes.statusCode).toEqual(200);
    });
  });
});