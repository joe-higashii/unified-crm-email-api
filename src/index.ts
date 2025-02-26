//index.ts
import prisma from './config/database';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Conexão com o banco de dados bem-sucedida!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

