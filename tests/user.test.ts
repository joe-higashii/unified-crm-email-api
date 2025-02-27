//user.test.ts

import request from 'supertest';
import app from '../src/app';

describe('User Endpoints', () => {
  let token: string;
  const userData = {
    nome: "User Tester",
    email: "usertester@example.com",
    senha: "password123"
  };

  beforeAll(async () => {
    await request(app).post('/auth/register').send(userData);
    const res = await request(app).post('/auth/login').send({ email: userData.email, senha: userData.senha });
    token = res.body.token;
  });

  it('should get user profile', async () => {
    const res = await request(app)
      .get('/usuarios/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update user profile', async () => {
    const res = await request(app)
      .patch('/usuarios/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: "Updated Name" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.nome).toEqual("Updated Name");
  });
});

