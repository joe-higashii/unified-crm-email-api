//relatorio.test.ts

import request from 'supertest';
import app from '../src/app';

describe('Relatórios Endpoints', () => {
  let token: string;
  let relatorioId: string;
  let campanhaId: string;
  let integracaoId: string;
  const userData = {
    nome: "Report Tester",
    email: "reporttester@example.com",
    senha: "password123"
  };

  beforeAll(async () => {
    // Registrar e logar o usuário
    await request(app).post('/auth/register').send(userData);
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: userData.email, senha: userData.senha });
    token = loginRes.body.token;

    // Criar uma Integração
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

    // Criar uma Campanha para usar na criação do relatório
    const campanhaData = {
      nome: "Campaign for Report",
      template: "<html>Template</html>",
      agendamento: new Date().toISOString(),
      integracaoId: integracaoId,
      parametros: { key: "value" }
    };
    const campanhaRes = await request(app)
      .post('/campanhas')
      .set('Authorization', `Bearer ${token}`)
      .send(campanhaData);
    campanhaId = campanhaRes.body.campanha.id;
  });

  it('should create a new relatório', async () => {
    const relatorioData = {
      campanhaId: campanhaId,
      aberturas: 100,
      cliques: 50,
      rejeicoes: 10,
      timestamp: new Date().toISOString()
    };
    const res = await request(app)
      .post('/relatorios')
      .set('Authorization', `Bearer ${token}`)
      .send(relatorioData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('relatorio');
    relatorioId = res.body.relatorio.id;
  });

  it('should list relatórios', async () => {
    const res = await request(app)
      .get('/relatorios')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update a relatório', async () => {
    const res = await request(app)
      .patch(`/relatorios/${relatorioId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ aberturas: 120 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.relatorio.aberturas).toEqual(120);
  });

  it('should delete a relatório', async () => {
    const res = await request(app)
      .delete(`/relatorios/${relatorioId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});

