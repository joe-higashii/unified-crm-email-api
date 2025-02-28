//swagger.ts

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Unified CRM Email API",
    version: "1.0.0",
    description:
      "API para integração entre CRMs e plataformas de email, com endpoints documentados, validação com Zod, tratamento de erros didático e suporte para usuários low-code/no-code. Esta documentação detalha todas as operações disponíveis para cadastro, autenticação, gerenciamento de leads, integrações, campanhas, relatórios, reset de senha e perfil do usuário. Os endpoints de listagem (getAll) agora suportam paginação, retornando metadados como total, totalPages e currentPage.",
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
        description:
          "Endpoint para cadastrar um novo usuário. Valida os dados de entrada (nome, email e senha) e cria um usuário com a senha criptografada.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string", example: "João Silva" },
                  email: { type: "string", format: "email", example: "joao@example.com" },
                  senha: { type: "string", minLength: 6, example: "senha123" },
                },
                required: ["nome", "email", "senha"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Usuário cadastrado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Usuário cadastrado com sucesso!" },
                    usuario: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "uuid-gerado" },
                        nome: { type: "string", example: "João Silva" },
                        email: { type: "string", example: "joao@example.com" },
                        plano: { type: "string", example: "GRATIS" },
                        role: { type: "string", example: "USER" },
                        criadoEm: { type: "string", format: "date-time" },
                        atualizadoEm: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": { description: "Dados insuficientes ou inválidos." },
          "409": { description: "Email já cadastrado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Login de usuário",
        description:
          "Endpoint para autenticar um usuário. Verifica se o email e a senha correspondem a um usuário cadastrado e, se válidos, retorna um token JWT.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email", example: "joao@example.com" },
                  senha: { type: "string", minLength: 6, example: "senha123" },
                },
                required: ["email", "senha"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login realizado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Login realizado com sucesso!" },
                    token: { type: "string", example: "token.jwt.aqui" },
                  },
                },
              },
            },
          },
          "400": { description: "Dados insuficientes ou inválidos." },
          "401": { description: "Credenciais inválidas." },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/leads": {
      post: {
        summary: "Criação de lead",
        description:
          "Cria um novo lead com informações como email, nome, telefone, status, ID da integração e campos customizados. Requer autenticação via token JWT.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email", example: "lead@example.com" },
                  nome: { type: "string", example: "Maria" },
                  telefone: { type: "string", example: "123456789" },
                  status: { type: "string", enum: ["NOVO", "CONTATADO", "CONVERTIDO", "INATIVO"], example: "NOVO" },
                  integracaoId: { type: "string", example: "uuid-integracao" },
                  camposCustom: { type: "object", example: { customField: "value" } },
                },
                required: ["email", "integracaoId"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Lead criado com sucesso.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Lead" },
              },
            },
          },
          "400": { description: "Dados inválidos." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
      get: {
        summary: "Listar leads com paginação",
        description:
          "Retorna uma lista de leads cadastrados com paginação. Parâmetros 'page' e 'limit' são opcionais.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Número da página (padrão: 1)",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Quantidade de itens por página (padrão: 10)",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          "200": {
            description: "Lista de leads com metadados de paginação.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    leads: { type: "array", items: { $ref: "#/components/schemas/Lead" } },
                    total: { type: "integer" },
                    totalPages: { type: "integer" },
                    currentPage: { type: "integer" },
                  },
                },
              },
            },
          },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/leads/{id}": {
      patch: {
        summary: "Atualizar lead",
        description: "Atualiza os dados de um lead existente. Requer autenticação.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID do lead a ser atualizado",
            required: true,
            schema: { type: "string" },
          },
        ],
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
                  camposCustom: { type: "object" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Lead atualizado com sucesso." },
          "400": { description: "Dados inválidos." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
      delete: {
        summary: "Remover lead",
        description: "Remove um lead existente. Requer autenticação.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID do lead a ser removido",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Lead removido com sucesso." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/integracoes": {
      post: {
        summary: "Criar integração",
        description:
          "Cria uma nova integração com informações sobre o tipo (CRM ou EMAIL_MARKETING), provedor, modo de teste, credenciais, ID do usuário e outros campos opcionais. Requer autenticação.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  tipo: { type: "string", enum: ["CRM", "EMAIL_MARKETING"], example: "CRM" },
                  provedor: { type: "string", enum: ["SALESFORCE", "ZOHO_CRM", "PIPEDRIVE", "HUBSPOT"], example: "SALESFORCE" },
                  modoTeste: { type: "boolean", example: true },
                  credenciais: { type: "string", example: "chave_criptografada" },
                  usuarioId: { type: "string", example: "uuid-usuario" },
                  sincronizadoEm: { type: "string", format: "date-time", example: "2023-12-31T23:59:59Z" },
                  camposExtras: { type: "object", example: { extraField: "value" } }
                },
                required: ["tipo", "provedor", "credenciais", "usuarioId"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Integração criada com sucesso." },
          "400": { description: "Dados inválidos." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
      get: {
        summary: "Listar integrações com paginação",
        description:
          "Retorna todas as integrações associadas ao usuário com paginação. O ID do usuário deve ser fornecido como query parameter.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "usuarioId",
            in: "query",
            description: "ID do usuário para filtrar integrações",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "page",
            in: "query",
            description: "Número da página (padrão: 1)",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Quantidade de itens por página (padrão: 10)",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          "200": {
            description: "Lista de integrações com metadados de paginação.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    integracoes: { type: "array", items: { $ref: "#/components/schemas/Integracao" } },
                    total: { type: "integer" },
                    totalPages: { type: "integer" },
                    currentPage: { type: "integer" },
                  },
                },
              },
            },
          },
          "400": { description: "Parâmetro 'usuarioId' obrigatório." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/integracoes/{id}": {
      get: {
        summary: "Obter integração por ID",
        description: "Recupera os detalhes de uma integração específica com base no ID. Requer autenticação.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID da integração",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Detalhes da integração." },
          "404": { description: "Integração não encontrada." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
      patch: {
        summary: "Atualizar integração",
        description: "Atualiza os dados de uma integração existente. Requer autenticação.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID da integração a ser atualizada",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  tipo: { type: "string", enum: ["CRM", "EMAIL_MARKETING"] },
                  provedor: { type: "string", enum: ["SALESFORCE", "ZOHO_CRM", "PIPEDRIVE", "HUBSPOT"] },
                  modoTeste: { type: "boolean" },
                  credenciais: { type: "string" },
                  sincronizadoEm: { type: "string", format: "date-time" },
                  camposExtras: { type: "object" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Integração atualizada com sucesso." },
          "400": { description: "Dados inválidos." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
      delete: {
        summary: "Remover integração",
        description: "Remove uma integração existente. Requer autenticação.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID da integração a ser removida",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Integração removida com sucesso." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/campanhas": {
      post: {
        summary: "Criar campanha",
        description:
          "Cria uma nova campanha de email com informações como nome, template HTML, data de agendamento, status, ID da integração, parâmetros de disparo e modo de teste. Requer autenticação.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string", example: "Campanha de Lançamento" },
                  template: { type: "string", example: "<html>...</html>" },
                  agendamento: { type: "string", format: "date-time", example: "2023-12-31T23:59:59Z" },
                  status: { type: "string", enum: ["RASCUNHO", "AGENDADA", "ENVIANDO", "ENVIADA", "CANCELADA"], example: "RASCUNHO" },
                  integracaoId: { type: "string", example: "uuid-integracao" },
                  parametros: { type: "object", example: { key: "value" } },
                  modoTeste: { type: "boolean", example: true },
                },
                required: ["nome", "template", "agendamento", "integracaoId", "parametros"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Campanha criada com sucesso." },
          "400": { description: "Dados inválidos." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
      get: {
        summary: "Listar campanhas com paginação",
        description:
          "Retorna uma lista de campanhas com paginação. Parâmetros 'page' e 'limit' são opcionais e pode ser filtrada pelo 'integracaoId'.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Número da página (padrão: 1)",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Quantidade de itens por página (padrão: 10)",
            schema: { type: "integer", default: 10 },
          },
          {
            name: "integracaoId",
            in: "query",
            description: "Filtrar campanhas pelo ID da integração",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Lista de campanhas com metadados de paginação.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    campanhas: { type: "array", items: { $ref: "#/components/schemas/Campanha" } },
                    total: { type: "integer" },
                    totalPages: { type: "integer" },
                    currentPage: { type: "integer" },
                  },
                },
              },
            },
          },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/campanhas/{id}": {
      get: {
        summary: "Obter campanha por ID",
        description: "Recupera os detalhes de uma campanha específica. Requer autenticação.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID da campanha",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Detalhes da campanha." },
          "404": { description: "Campanha não encontrada." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
      patch: {
        summary: "Atualizar campanha",
        description: "Atualiza os dados de uma campanha existente. Requer autenticação.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID da campanha a ser atualizada",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string" },
                  template: { type: "string" },
                  agendamento: { type: "string", format: "date-time" },
                  status: { type: "string", enum: ["RASCUNHO", "AGENDADA", "ENVIANDO", "ENVIADA", "CANCELADA"] },
                  parametros: { type: "object" },
                  modoTeste: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Campanha atualizada com sucesso." },
          "400": { description: "Dados inválidos." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
      delete: {
        summary: "Remover campanha",
        description: "Remove uma campanha existente. Requer autenticação.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID da campanha a ser removida",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Campanha removida com sucesso." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/password-reset/request": {
      post: {
        summary: "Solicitar reset de senha",
        description: "Gera um token de reset de senha para o usuário. Normalmente, esse token seria enviado por email (simulação).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  usuarioId: { type: "string", example: "uuid-usuario" },
                },
                required: ["usuarioId"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Token de reset gerado com sucesso." },
          "400": { description: "Dados inválidos." },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/password-reset/reset": {
      post: {
        summary: "Redefinir senha",
        description: "Redefine a senha do usuário utilizando o token de reset fornecido.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string", example: "token-gerado" },
                  novaSenha: { type: "string", minLength: 6, example: "novaSenha123" },
                },
                required: ["token", "novaSenha"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Senha redefinida com sucesso." },
          "400": { description: "Dados inválidos." },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/usuarios/me": {
      get: {
        summary: "Obter perfil do usuário",
        description: "Retorna os dados do usuário autenticado.",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Dados do usuário autenticado.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    nome: { type: "string" },
                    email: { type: "string" },
                    plano: { type: "string" },
                    role: { type: "string" },
                    criadoEm: { type: "string", format: "date-time" },
                    atualizadoEm: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
      patch: {
        summary: "Atualizar perfil do usuário",
        description: "Atualiza os dados do usuário autenticado.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string" },
                  email: { type: "string", format: "email" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Perfil atualizado com sucesso." },
          "400": { description: "Dados inválidos." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/relatorios": {
      post: {
        summary: "Criar relatório",
        description: "Cria um novo relatório (métrica de campanha) com informações de aberturas, cliques e rejeições, vinculadas a uma campanha. Requer autenticação.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  campanhaId: { type: "string", example: "uuid-campanha" },
                  aberturas: { type: "number", example: 100 },
                  cliques: { type: "number", example: 50 },
                  rejeicoes: { type: "number", example: 10 },
                  timestamp: { type: "string", format: "date-time", example: "2023-12-31T23:59:59Z" }
                },
                required: ["campanhaId", "aberturas", "cliques", "rejeicoes"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Relatório criado com sucesso." },
          "400": { description: "Dados inválidos." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
      get: {
        summary: "Listar relatórios com paginação",
        description: "Retorna uma lista de relatórios de campanhas com paginação. Parâmetros 'page' e 'limit' são opcionais.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Número da página (padrão: 1)",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Quantidade de itens por página (padrão: 10)",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          "200": {
            description: "Lista de relatórios com metadados de paginação.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    relatorios: { type: "array", items: { $ref: "#/components/schemas/Relatorio" } },
                    total: { type: "integer" },
                    totalPages: { type: "integer" },
                    currentPage: { type: "integer" },
                  },
                },
              },
            },
          },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
    },
    "/relatorios/{id}": {
      get: {
        summary: "Obter relatório por ID",
        description: "Recupera os detalhes de um relatório específico. Requer autenticação.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID do relatório",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Detalhes do relatório." },
          "404": { description: "Relatório não encontrado." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
      patch: {
        summary: "Atualizar relatório",
        description: "Atualiza os dados de um relatório existente. Requer autenticação.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID do relatório a ser atualizado",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  campanhaId: { type: "string" },
                  aberturas: { type: "number" },
                  cliques: { type: "number" },
                  rejeicoes: { type: "number" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Relatório atualizado com sucesso." },
          "400": { description: "Dados inválidos." },
          "401": { description: "Não autorizado." },
          "500": { description: "Erro interno no servidor." },
        },
      },
      delete: {
        summary: "Remover relatório",
        description: "Remove um relatório existente. Requer autenticação.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID do relatório a ser removido",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Relatório removido com sucesso." },
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
    schemas: {
      Lead: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid-lead" },
          email: { type: "string", format: "email", example: "lead@example.com" },
          nome: { type: "string", example: "Maria" },
          telefone: { type: "string", example: "123456789" },
          status: { type: "string", enum: ["NOVO", "CONTATADO", "CONVERTIDO", "INATIVO"], example: "NOVO" },
          integracaoId: { type: "string", example: "uuid-integracao" },
          camposCustom: { type: "object" },
          criadoEm: { type: "string", format: "date-time" },
          atualizadoEm: { type: "string", format: "date-time" },
        },
      },
      Campanha: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid-campanha" },
          nome: { type: "string", example: "Campanha de Lançamento" },
          template: { type: "string", example: "<html>...</html>" },
          agendamento: { type: "string", format: "date-time", example: "2023-12-31T23:59:59Z" },
          status: { type: "string", enum: ["RASCUNHO", "AGENDADA", "ENVIANDO", "ENVIADA", "CANCELADA"], example: "RASCUNHO" },
          integracaoId: { type: "string", example: "uuid-integracao" },
          parametros: { type: "object", example: { key: "value" } },
          modoTeste: { type: "boolean", example: true },
          criadoEm: { type: "string", format: "date-time" },
          atualizadoEm: { type: "string", format: "date-time" },
        },
      },
      Relatorio: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid-relatorio" },
          campanhaId: { type: "string", example: "uuid-campanha" },
          aberturas: { type: "number", example: 100 },
          cliques: { type: "number", example: 50 },
          rejeicoes: { type: "number", example: 10 },
          timestamp: { type: "string", format: "date-time", example: "2023-12-31T23:59:59Z" },
        },
      },
      Integracao: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid-integracao" },
          tipo: { type: "string", enum: ["CRM", "EMAIL_MARKETING"], example: "CRM" },
          provedor: { type: "string", enum: ["SALESFORCE", "ZOHO_CRM", "PIPEDRIVE", "HUBSPOT"], example: "SALESFORCE" },
          modoTeste: { type: "boolean", example: true },
          credenciais: { type: "string", example: "chave_criptografada" },
          usuarioId: { type: "string", example: "uuid-usuario" },
          sincronizadoEm: { type: "string", format: "date-time" },
          camposExtras: { type: "object" },
        },
      },
    },
  },
};

export default swaggerDocument;

