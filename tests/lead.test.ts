//lead.test.ts

import request from 'supertest';
import app from '../src/app';

describe('Leads Endpoints', () => {
  let token: string;
  let leadId: string;
  let integracaoId: string;
  const userData = {
    nome: "Lead Tester",
    email: "leadtester@example.com",
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
      usuarioId: "", // preencher com o ID do usuário (obtido no perfil)
    };

    // Obter o perfil para ter o ID do usuário
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

  it('should create a new lead', async () => {
    const leadData = {
      email: "lead@example.com",
      nome: "Test Lead",
      integracaoId: integracaoId, // usar a integração criada
    };
    const res = await request(app)
      .post('/leads')
      .set('Authorization', `Bearer ${token}`)
      .send(leadData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('lead');
    leadId = res.body.lead.id;
  });

  it('should list leads', async () => {
    const res = await request(app)
      .get('/leads')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
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

