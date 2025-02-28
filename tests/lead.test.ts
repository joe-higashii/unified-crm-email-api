//lead.test.ts

import request from 'supertest';
import app from '../src/app';

describe('Leads Endpoints', () => {
  let token: string;
  let leadId: string;
  let integracaoId: string;
  const userData = {
    nome: "Lead Tester",
    email: `leadtester+${Date.now()}@example.com`,
    senha: "password123"
  };

  beforeAll(async () => {
    // Registrar e logar o usuário
    await request(app).post('/auth/register').send(userData);
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: userData.email, senha: userData.senha });
    token = loginRes.body.token;

    // Obter o ID do usuário
    const profileRes = await request(app)
      .get('/usuarios/me')
      .set('Authorization', `Bearer ${token}`);
    const usuarioId = profileRes.body.id;

    // Criar ou obter a integração para o usuário
    const integracaoData = {
      tipo: "CRM",
      provedor: "SALESFORCE",
      credenciais: "dummy-credenciais",
      usuarioId: usuarioId,
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

  it('should create a new lead', async () => {
    const leadData = {
      email: "lead@example.com",
      nome: "Test Lead",
      integracaoId: integracaoId,
    };
    const res = await request(app)
      .post('/leads')
      .set('Authorization', `Bearer ${token}`)
      .send(leadData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('lead');
    leadId = res.body.lead.id;
  });

  it('should list leads with pagination', async () => {
    const res = await request(app)
      .get('/leads')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 1, limit: 10 });
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe("object");
    expect(Array.isArray(res.body.leads)).toBe(true);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("currentPage");
  });

  it('should update a lead', async () => {
    const res = await request(app)
      .patch(`/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: "Updated Lead" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.lead.nome).toEqual("Updated Lead");
  });

  it('should delete a lead', async () => {
    const res = await request(app)
      .delete(`/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});

