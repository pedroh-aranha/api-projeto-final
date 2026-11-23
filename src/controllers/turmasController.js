// Controller: as regras de cada operação de turmas. Os dados vêm do banco (Prisma).
import { prisma } from '../lib/prisma.js';

// GET /api/turmas
export async function listar(req, res) {
  const turmas = await prisma.turma.findMany({ orderBy: { id: 'asc' } });
  res.json(turmas);
}

// GET /api/turmas/:id
export async function buscarPorId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'O id precisa ser um número' });
  }
  const turma = await prisma.turma.findUnique({ where: { id } });
  if (!turma) {
    return res.status(404).json({ erro: 'Turma não encontrada' });
  }
  res.json(turma);
}

// POST /api/turmas
export async function criar(req, res) {
  // req.body vem vazio (undefined) se o cliente não enviar JSON; ?? {} evita o erro
  const { diaSemana, horario, instrutor, vagas, status, modalidadeId } = req.body ?? {};
  if (!diaSemana) {
    return res.status(400).json({ erro: 'O campo diaSemana é obrigatório' });
  }
  if (!horario) {
    return res.status(400).json({ erro: 'O campo horario é obrigatório' });
  }
  if (!modalidadeId) {
    return res.status(400).json({ erro: 'O campo modalidadeId é obrigatório' });
  }
  const modalidade = await prisma.modalidade.findUnique({ where: { id: Number(modalidadeId) } });
  if (!modalidade) {
    return res.status(400).json({ erro: 'modalidadeId não existe' });
  }
  // campos que não chegaram ficam undefined: o banco usa o valor padrão ou deixa vazio
  const novo = await prisma.turma.create({
    data: {
      diaSemana,
      horario,
      instrutor,
      vagas,
      status,
      modalidadeId: modalidade.id,
    },
  });
  res.status(201).json(novo);
}

// PUT /api/turmas/:id
export async function atualizar(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'O id precisa ser um número' });
  }
  const existe = await prisma.turma.findUnique({ where: { id } });
  if (!existe) {
    return res.status(404).json({ erro: 'Turma não encontrada' });
  }
  const dados = req.body ?? {};
  if (dados.diaSemana === '') {
    return res.status(400).json({ erro: 'O campo diaSemana não pode ficar vazio' });
  }
  if (dados.horario === '') {
    return res.status(400).json({ erro: 'O campo horario não pode ficar vazio' });
  }
  // campos que não chegaram ficam undefined, e o Prisma não os altera
  const atualizado = await prisma.turma.update({
    where: { id },
    data: {
      diaSemana: dados.diaSemana,
      horario: dados.horario,
      instrutor: dados.instrutor,
      vagas: dados.vagas,
      status: dados.status,
    },
  });
  res.json(atualizado);
}

// DELETE /api/turmas/:id
export async function excluir(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'O id precisa ser um número' });
  }
  const existe = await prisma.turma.findUnique({ where: { id } });
  if (!existe) {
    return res.status(404).json({ erro: 'Turma não encontrada' });
  }
  await prisma.turma.delete({ where: { id } });
  res.status(204).send();
}