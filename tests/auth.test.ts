//auth.test.ts

import request from 'supertest';
import app from '../src/app';

describe('Auth Endpoints', () => {
  const userData = {
    nome: "Test User",
    email: "testuser@example.com",
    senha: "password123"
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(userData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('usuario');
  });

  it('should login and return a token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: userData.email, senha: userData.senha });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});

