const request = require('supertest');
const app = require('../index'); // Ensure the path is correct
const User = require('../models/userRegistration');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Login', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({
      email: 'test2@example.com',
      password: await bcrypt.hash('password123', 10)
    });
    await user.save();
  });

  it('should log in the user successfully', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'test2@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('user login successfully');
    expect(response.body.token).toBeDefined();
  });

  it('should fail to log in with incorrect password', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'test2@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('user not login ');
  });

  it('should fail to log in with non-existing email', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('user not registered ');
  });
});
