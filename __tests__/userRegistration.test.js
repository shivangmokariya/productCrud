const request = require('supertest');
const app = require('../index'); // Ensure the path is correct
const User = require('../models/userRegistration');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Registration', () => {
  afterEach(async () => {
    // await User.deleteMany({});
  });

  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/api/registration')
      .send({
        email: 'user@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('user registerd successfully');
    expect(response.body.data).toHaveProperty('_id');
  });

  it('should not register a user with an existing email', async () => {
    await request(app).post('/api/registration').send({
      email: 'user@example.com',
      password: 'password123'
    });

    const response = await request(app)
      .post('/api/registration')
      .send({
        email: 'user@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email already exists.');
  });
});
