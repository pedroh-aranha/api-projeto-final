// Controller: as regras de cada operação de usuários. Os dados vêm do banco (Prisma).
import { prisma } from '../lib/prisma.js';

// Campos públicos retornados nas consultas (evita expor senhaHash)
const camposPublicos = {
  id: true,
  nome: true,
  email: true,
  criadoEm: true,
};

// GET /api/usuarios
export async function listar(req, res) {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { id: 'asc' },
    select: camposPublicos,
  });
  res.json(usuarios);
}

// GET /api/usuarios/:id
export async function buscarPorId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'O id precisa ser um número' });
  }
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: camposPublicos,
  });
  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }
  res.json(usuario);
}

// POST /api/usuarios
export async function criar(req, res) {
  // req.body vem vazio (undefined) se o cliente não enviar JSON; ?? {} evita o erro
  const { nome, email, senhaHash } = req.body ?? {};
  if (!nome) {
    return res.status(400).json({ erro: 'O campo nome é obrigatório' });
  }
  if (!email) {
    return res.status(400).json({ erro: 'O campo email é obrigatório' });
  }
  if (!senhaHash) {
    return res.status(400).json({ erro: 'O campo senhaHash é obrigatório' });
  }
  const emailEmUso = await prisma.usuario.findUnique({ where: { email } });
  if (emailEmUso) {
    return res.status(400).json({ erro: 'Este email já está cadastrado' });
  }
  const novo = await prisma.usuario.create({
    data: {
      nome,
      email,
      senhaHash,
    },
    select: camposPublicos,
  });
  res.status(201).json(novo);
}

// PUT /api/usuarios/:id
export async function atualizar(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'O id precisa ser um número' });
  }
  const existe = await prisma.usuario.findUnique({ where: { id } });
  if (!existe) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }
  const dados = req.body ?? {};
  if (dados.nome === '') {
    return res.status(400).json({ erro: 'O campo nome não pode ficar vazio' });
  }
  if (dados.email === '') {
    return res.status(400).json({ erro: 'O campo email não pode ficar vazio' });
  }
  if (dados.senhaHash === '') {
    return res.status(400).json({ erro: 'O campo senhaHash não pode ficar vazio' });
  }
  if (dados.email && dados.email !== existe.email) {
    const emailEmUso = await prisma.usuario.findUnique({ where: { email: dados.email } });
    if (emailEmUso) {
      return res.status(400).json({ erro: 'Este email já está cadastrado' });
    }
  }
  // campos que não chegaram ficam undefined, e o Prisma não os altera
  const atualizado = await prisma.usuario.update({
    where: { id },
    data: {
      nome: dados.nome,
      email: dados.email,
      senhaHash: dados.senhaHash,
    },
    select: camposPublicos,
  });
  res.json(atualizado);
}

// DELETE /api/usuarios/:id
export async function excluir(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'O id precisa ser um número' });
  }
  const existe = await prisma.usuario.findUnique({ where: { id } });
  if (!existe) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }
  await prisma.usuario.delete({ where: { id } });
  res.status(204).send();
}