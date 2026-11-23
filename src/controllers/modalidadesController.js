// Controller: as regras de cada operação de modalidades. Os dados vêm do banco (Prisma).
import { prisma } from '../lib/prisma.js';

// GET /api/modalidades
export async function listar(req, res) {
  const modalidades = await prisma.modalidade.findMany({ orderBy: { id: 'asc' } });
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
  // req.body vem vazio (undefined) se o cliente não enviar JSON; ?? {} evita o erro
  const { nome } = req.body ?? {};
  if (!nome) {
    return res.status(400).json({ erro: 'O campo nome é obrigatório' });
  }
  const nomeEmUso = await prisma.modalidade.findUnique({ where: { nome } });
  if (nomeEmUso) {
    return res.status(400).json({ erro: 'Já existe uma modalidade com esse nome' });
  }
  const novo = await prisma.modalidade.create({
    data: {
      nome,
    },
  });
  res.status(201).json(novo);
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