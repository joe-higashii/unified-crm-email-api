//swagger.ts

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
      title: "Unified CRM Email API",
      version: "1.0.0",
      description: "API para integração entre CRMs e plataformas de email, com endpoints documentados, validação com Zod e tratamento de erros didático.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    paths: {
      "/auth/register": {
        post: {
          summary: "Cadastro de usuário",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nome: { type: "string" },
                    email: { type: "string", format: "email" },
                    senha: { type: "string", minLength: 6 },
                  },
                  required: ["nome", "email", "senha"],
                },
                examples: {
                  example1: {
                    value: {
                      nome: "João Silva",
                      email: "joao@example.com",
                      senha: "senha123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Usuário cadastrado com sucesso." },
            "400": { description: "Dados insuficientes ou inválidos." },
            "409": { description: "Email já cadastrado." },
            "500": { description: "Erro interno no servidor." },
          },
        },
      },
      "/auth/login": {
        post: {
          summary: "Login de usuário",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", format: "email" },
                    senha: { type: "string", minLength: 6 },
                  },
                  required: ["email", "senha"],
                },
                examples: {
                  example1: {
                    value: {
                      email: "joao@example.com",
                      senha: "senha123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Login realizado com sucesso." },
            "400": { description: "Dados insuficientes ou inválidos." },
            "401": { description: "Credenciais inválidas." },
            "500": { description: "Erro interno no servidor." },
          },
        },
      },
      "/leads": {
        post: {
          summary: "Criação de lead",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", format: "email" },
                    nome: { type: "string" },
                    telefone: { type: "string" },
                    status: { type: "string", enum: ["NOVO", "CONTATADO", "CONVERTIDO", "INATIVO"] },
                    integracaoId: { type: "string" },
                    camposCustom: { type: "object" },
                  },
                  required: ["email", "integracaoId"],
                },
                examples: {
                  example1: {
                    value: {
                      email: "lead@example.com",
                      nome: "Maria",
                      telefone: "123456789",
                      status: "NOVO",
                      integracaoId: "uuid-integracao",
                      camposCustom: { customField: "value" },
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Lead criado com sucesso." },
            "400": { description: "Dados inválidos." },
            "401": { description: "Não autorizado." },
            "500": { description: "Erro interno no servidor." },
          },
        },
        get: {
          summary: "Listar leads",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "Lista de leads." },
            "401": { description: "Não autorizado." },
            "500": { description: "Erro interno no servidor." },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  };
  
export default swaggerDocument;

