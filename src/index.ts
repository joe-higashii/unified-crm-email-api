//index.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger';

import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import integracaoRoutes from './routes/integracaoRoutes';
import campanhaRoutes from './routes/campanhaRoutes';
import passwordResetRoutes from './routes/passwordResetRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger UI para documentação interativa
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas públicas e protegidas
app.use('/auth', authRoutes);
app.use('/leads', leadRoutes);
app.use('/integracoes', integracaoRoutes);
app.use('/campanhas', campanhaRoutes);
app.use('/password-reset', passwordResetRoutes);
app.use('/usuarios', userRoutes);

// Middleware global de tratamento de erros
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

