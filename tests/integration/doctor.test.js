const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const Doctor = require('../../models/Doctor');
const { connectDB, disconnectDB } = require('../../config/db');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

describe('Doctor Integration Tests', () => {
  let adminToken;
  let doctorToken;
  let doctorUserId;
  let doctorId;

  beforeAll(async () => {
    await connectDB();

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });

    // Create doctor user
    const doctorUser = await User.create({
      name: 'Doctor',
      email: 'doctor@test.com',
      password: 'password123',
      role: 'doctor'
    });

    doctorUserId = doctorUser._id;

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

  describe('Doctor Profile Management', () => {
    it('should create, update, and delete doctor profile', async () => {
      // Create doctor profile
      const createRes = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: doctorUserId,
          specialties: [{ name: 'Neurology' }],
          education: [{ degree: 'MD', university: 'Stanford', year: 2012 }],
          experience: [{ position: 'Neurologist', hospital: 'City Hospital', from: '2018-01-01' }],
          fees: 150
        });

      expect(createRes.statusCode).toEqual(201);
      doctorId = createRes.body.data._id;

      // Update doctor profile
      const updateRes = await request(app)
        .put(`/api/doctors/${doctorId}`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({ fees: 200 });

      expect(updateRes.statusCode).toEqual(200);
      expect(updateRes.body.data.fees).toEqual(200);

      // Delete doctor profile
      const deleteRes = await request(app)
        .delete(`/api/doctors/${doctorId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(deleteRes.statusCode).toEqual(200);
    });
  });

  describe('Doctor Availability', () => {
    beforeEach(async () => {
      // Create doctor profile for availability tests
      const doctor = await Doctor.create({
        user: doctorUserId,
        specialties: [{ name: 'Pediatrics' }],
        education: [{ degree: 'MD', university: 'Yale', year: 2015 }],
        experience: [{ position: 'Pediatrician', hospital: 'Children Hospital', from: '2020-01-01' }],
        fees: 120
      });
      doctorId = doctor._id;
    });

    afterEach(async () => {
      await Doctor.findByIdAndDelete(doctorId);
    });

    it('should add and get availability', async () => {
      // Add availability
      const addRes = await request(app)
        .post(`/api/doctors/${doctorId}/availability`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          day: 1, // Monday
          startTime: '09:00',
          endTime: '17:00',
          slotDuration: 30
        });

      expect(addRes.statusCode).toEqual(201);

      // Get availability
      const getRes = await request(app)
        .get(`/api/doctors/${doctorId}/availability`);

      expect(getRes.statusCode).toEqual(200);
      expect(getRes.body.count).toEqual(1);
    });
  });
});