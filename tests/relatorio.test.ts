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
    email: `reporttester+${Date.now()}@example.com`,
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

    // Criar ou obter uma integração
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

    // Criar uma campanha para usar na criação do relatório
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
      campanhaId,
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

  it('should list relatórios with pagination', async () => {
    const res = await request(app)
      .get('/relatorios')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 1, limit: 10 });
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe("object");
    expect(Array.isArray(res.body.relatorios)).toBe(true);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("currentPage");
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

