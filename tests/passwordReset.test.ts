//passwordReset.test.ts

import request from 'supertest';
import app from '../src/app';

describe('Password Reset Endpoints', () => {
  const userData = {
    nome: "Password Tester",
    email: "passwordtester@example.com",
    senha: "password123"
  };
  let tokenAuth: string;
  let resetToken: string;

  beforeAll(async () => {
    await request(app).post('/auth/register').send(userData);
    const res = await request(app).post('/auth/login').send({ email: userData.email, senha: userData.senha });
    tokenAuth = res.body.token;
  });

  it('should request a password reset', async () => {
    // Para teste, usamos o ID do usuário obtido no cadastro
    // Primeiro, obtemos o perfil do usuário
    const profileRes = await request(app)
      .get('/usuarios/me')
      .set('Authorization', `Bearer ${tokenAuth}`);
    const usuarioId = profileRes.body.id;
    
    const res = await request(app)
      .post('/password-reset/request')
      .send({ usuarioId });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    resetToken = res.body.token;
  });

  it('should reset password with valid token', async () => {
    const res = await request(app)
      .post('/password-reset/reset')
      .send({ token: resetToken, novaSenha: "newpassword123" });
    expect(res.statusCode).toEqual(200);
  });
});

