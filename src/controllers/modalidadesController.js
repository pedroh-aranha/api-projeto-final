// Controller de modalidades (tabela de apoio): listar e cadastrar.
import { prisma } from '../lib/prisma.js';
import { ErroApi } from '../erros.js';

// GET /api/modalidades
export async function listar(req, res) {
  const modalidades = await prisma.modalidade.findMany({ orderBy: { nome: 'asc' } });
  res.json(modalidades);
}


// GET /api/modalidades/:id
export async function buscarPorId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'O id precisa ser um número' });
  }
  const modalidade = await prisma.modalidade.findUnique({ where: { id } });
  if (!modalidade) {
    return res.status(404).json({ erro: 'Modalidade não encontrada' });
  }
  res.json(modalidade);
}

// POST /api/modalidades
export async function criar(req, res) {
  const { nome } = req.body ?? {};
  if (typeof nome !== 'string' || nome.trim() === '') {
    throw new ErroApi(400, 'Dados inválidos', ['nome é obrigatório e precisa ser um texto']);
  }
  // nome repetido: o banco recusa (@unique) e o app.js responde 409
  const nova = await prisma.modalidade.create({ data: { nome: nome.trim() } });
  res.status(201).json(nova);
}

// PUT /api/modalidades/:id
export async function atualizar(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'O id precisa ser um número' });
  }
  const existe = await prisma.modalidade.findUnique({ where: { id } });
  if (!existe) {
    return res.status(404).json({ erro: 'Modalidade não encontrada' });
  }
  const dados = req.body ?? {};
  if (dados.nome === '') {
    return res.status(400).json({ erro: 'O campo nome não pode ficar vazio' });
  }
  if (dados.nome && dados.nome !== existe.nome) {
    const nomeEmUso = await prisma.modalidade.findUnique({ where: { nome: dados.nome } });
    if (nomeEmUso) {
      return res.status(400).json({ erro: 'Já existe uma modalidade com esse nome' });
    }
  }
  // campos que não chegaram ficam undefined, e o Prisma não os altera
  const atualizado = await prisma.modalidade.update({
    where: { id },
    data: {
      nome: dados.nome,
    },
  });
  res.json(atualizado);
}

// DELETE /api/modalidades/:id
export async function excluir(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'O id precisa ser um número' });
  }
  const existe = await prisma.modalidade.findUnique({ where: { id } });
  if (!existe) {
    return res.status(404).json({ erro: 'Modalidade não encontrada' });
  }
  const turmasVinculadas = await prisma.turma.count({ where: { modalidadeId: id } });
  if (turmasVinculadas > 0) {
    return res.status(400).json({ erro: 'Não é possível excluir uma modalidade que possui turmas vinculadas' });
  }
  await prisma.modalidade.delete({ where: { id } });
  res.status(204).send();
}