//app.ts

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger";
import requestLogger from "./middlewares/requestLogger";
import { authLimiter, globalLimiter } from "./middlewares/rateLimiter";

// Importação das rotas
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import leadRoutes from "./routes/leadRoutes";
import campanhaRoutes from "./routes/campanhaRoutes";
import integracaoRoutes from "./routes/integracaoRoutes";
import relatorioRoutes from "./routes/relatorioRoutes";
import passwordResetRoutes from "./routes/passwordResetRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(requestLogger);
app.use(globalLimiter);

// Rota de autenticação com rate limiting
app.use("/auth", authLimiter, authRoutes);

// Rotas protegidas
app.use("/usuarios", userRoutes);
app.use("/leads", leadRoutes);
app.use("/campanhas", campanhaRoutes);
app.use("/integracoes", integracaoRoutes);
app.use("/relatorios", relatorioRoutes);
app.use("/password-reset", passwordResetRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware global de tratamento de erros
app.use(errorHandler);

export default app;

