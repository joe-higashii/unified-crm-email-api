//integracao.test.ts

import request from 'supertest';
import app from '../src/app';

describe('Integrações Endpoints', () => {
  let token: string;
  let integracaoId: string;
  const userData = {
    nome: "Integration Tester",
    email: `integrationtester+${Date.now()}@example.com`,
    senha: "password123"
  };

  beforeAll(async () => {
    await request(app).post('/auth/register').send(userData);
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: userData.email, senha: userData.senha });
    token = loginRes.body.token;

    const profileRes = await request(app)
      .get('/usuarios/me')
      .set('Authorization', `Bearer ${token}`);
    const usuarioId = profileRes.body.id;

    const integracaoData = {
      tipo: "CRM",
      provedor: "SALESFORCE",
      credenciais: "dummy-credenciais",
      usuarioId,
    };

    const getIntegracaoRes = await request(app)
      .get('/integracoes')
      .set('Authorization', `Bearer ${token}`)
      .query({ usuarioId });
    if (getIntegracaoRes.body.integracoes && getIntegracaoRes.body.integracoes.length > 0) {
      integracaoId = getIntegracaoRes.body.integracoes[0].id;
    } else {
      const createIntegracaoRes = await request(app)
        .post('/integracoes')
        .set('Authorization', `Bearer ${token}`)
        .send(integracaoData);
      integracaoId = createIntegracaoRes.body.integracao.id;
    }
  });

  it('should list integrações with pagination', async () => {
    const profileRes = await request(app)
      .get('/usuarios/me')
      .set('Authorization', `Bearer ${token}`);
    const usuarioId = profileRes.body.id;
    const res = await request(app)
      .get('/integracoes')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 1, limit: 10, usuarioId });
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe("object");
    expect(Array.isArray(res.body.integracoes)).toBe(true);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("currentPage");
  });
});

