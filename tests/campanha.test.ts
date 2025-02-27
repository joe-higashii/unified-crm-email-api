//campanha.test.ts

import request from 'supertest';
import app from '../src/app';

describe('Campanhas Endpoints', () => {
  let token: string;
  let campanhaId: string;
  let integracaoId: string;
  const userData = {
    nome: "Campaign Tester",
    email: "campaigntester@example.com",
    senha: "password123"
  };

  beforeAll(async () => {
    // Registrar e logar o usuário
    await request(app).post('/auth/register').send(userData);
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: userData.email, senha: userData.senha });
    token = loginRes.body.token;

    // Criar uma Integração para o usuário
    const integracaoData = {
      tipo: "CRM",
      provedor: "SALESFORCE",
      credenciais: "dummy-credenciais",
      usuarioId: "",
    };
    const profileRes = await request(app)
      .get('/usuarios/me')
      .set('Authorization', `Bearer ${token}`);
    integracaoData.usuarioId = profileRes.body.id;
    const integracaoRes = await request(app)
      .post('/integracoes')
      .set('Authorization', `Bearer ${token}`)
      .send(integracaoData);
    integracaoId = integracaoRes.body.integracao.id;
  });

  it('should create a new campanha', async () => {
    const campanhaData = {
      nome: "New Campaign",
      template: "<html>Campaign Template</html>",
      agendamento: new Date().toISOString(),
      integracaoId: integracaoId,
      parametros: { key: "value" }
    };
    const res = await request(app)
      .post('/campanhas')
      .set('Authorization', `Bearer ${token}`)
      .send(campanhaData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('campanha');
    campanhaId = res.body.campanha.id;
  });

  it('should list campanhas', async () => {
    const res = await request(app)
      .get('/campanhas')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update a campanha', async () => {
    const res = await request(app)
      .patch(`/campanhas/${campanhaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: "Updated Campaign" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.campanha.nome).toEqual("Updated Campaign");
  });

  it('should delete a campanha', async () => {
    const res = await request(app)
      .delete(`/campanhas/${campanhaId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});

