/*
// app.js: monta a aplicação Express (rotas, middlewares).
// Quem liga o servidor é o server.js. Separar os dois facilita testes e o deploy.
import express from 'express';

const app = express();

// Permite receber JSON no corpo das requisições (usaremos no próximo encontro)
app.use(express.json());

// Rota de saúde: usada por serviços de nuvem para saber se a API está viva
app.get('/health', (req, res) => {
  res.json({ status: 'ok', horario: new Date().toISOString() });
});

// Rota raiz: apresenta a API
app.get('/', (req, res) => {
  res.json({
    nome: 'gym controller',
    versao: '0.1.0',
    rotas: ['GET /health'],
  });
});



export default app;*/
// app.js: monta a aplicação Express (middlewares e rotas).
import express from 'express';
import modalidadesRoutes from './routes/modalidadesRoutes.js';
import turmasRoutes from './routes/turmasRoutes.js'
import usuariosRoutes from './routes/usuariosRoutes.js';
import { ErroApi } from './erros.js';

const app = express();

// Permite receber JSON no corpo das requisições (req.body)
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', horario: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    nome: 'API Help Desk TechNova',
    versao: '0.2.0',
    rotas: [
      'GET /api/modalidades',
      'GET /api/modalidades/:id',
      'POST /api/modalidades',
      'PUT /api/modalidades/:id',
      'DELETE /api/modalidades/:id',

      'GET /api/turmas',
      'GET /api/turmas/:id',
      'POST /api/turmas',
      'PUT /api/turmas/:id',
      'DELETE /api/turmas/:id',

      'GET /api/usuarios',
      'GET /api/usuarios/:id',
      'POST /api/usuarios',
      'PUT /api/usuarios/:id',
      'DELETE /api/usuarios/:id',
    ],
  });
});

// Todas as rotas de chamados começam com /api/chamados
app.use('/api/modalidades', modalidadesRoutes);
app.use('/api/turmas', turmasRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Qualquer rota que não existe: 404 em JSON
app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.path} não existe` });
});

// Tratamento de erros: sempre o último app.use. Todo erro sai no mesmo formato.
app.use((erro, req, res, next) => {
  // erros que nós mesmos lançamos com throw new ErroApi(...)
  if (erro instanceof ErroApi) {
    return res.status(erro.status).json({ erro: erro.message, detalhes: erro.detalhes });
  }
  // JSON mal escrito no corpo da requisição
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
  }
  // Prisma: valor repetido num campo único (@unique)
  if (erro.code === 'P2002') {
    return res.status(409).json({ erro: 'Já existe um registro com esse valor' });
  }
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno no servidor' });
});

export default app;