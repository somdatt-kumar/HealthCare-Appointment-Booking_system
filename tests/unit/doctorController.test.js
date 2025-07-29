const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const Doctor = require('../../models/Doctor');
const { connectDB, disconnectDB } = require('../../config/db');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

describe('Doctor Controller', () => {
  let adminToken;
  let doctorToken;
  let doctorId;

  beforeAll(async () => {
    await connectDB();

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    // Create doctor user
    const doctorUser = await User.create({
      name: 'Doctor User',
      email: 'doctor@example.com',
      password: 'password123',
      role: 'doctor'
    });

    // Generate tokens
    adminToken = jwt.sign({ id: adminUser._id }, config.jwtSecret, {
      expiresIn: config.jwtExpire
    });

    doctorToken = jwt.sign({ id: doctorUser._id }, config.jwtSecret, {
      expiresIn: config.jwtExpire
    });
  });

  afterAll(async () => {
    await User.deleteMany();
    await Doctor.deleteMany();
    await disconnectDB();
  });

  describe('POST /api/doctors', () => {
    it('should create a new doctor profile (admin only)', async () => {
      const user = await User.findOne({ email: 'doctor@example.com' });
      
      const res = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: user._id,
          specialties: [{ name: 'Cardiology' }],
          education: [{ degree: 'MD', university: 'Harvard', year: 2010 }],
          experience: [{ position: 'Cardiologist', hospital: 'General Hospital', from: '2015-01-01' }],
          fees: 100
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('user');
      doctorId = res.body.data._id;
    });
  });

  describe('GET /api/doctors', () => {
    it('should get all doctors', async () => {
      const res = await request(app)
        .get('/api/doctors');

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toBeGreaterThan(0);
    });
  });

  describe('GET /api/doctors/:id', () => {
    it('should get a single doctor', async () => {
      const res = await request(app)
        .get(`/api/doctors/${doctorId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty('_id', doctorId);
    });
  });
});