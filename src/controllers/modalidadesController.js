import { modalidades } from "../data/modalidades.js";

//get
export function listarModalidades (req, res) {
  res.json(modalidades)
};

// GET /api/modalidades/:id
export function buscarPorId(req, res) {
  const id = Number(req.params.id);
  const modalidade = modalidades.find((m) => m.id === id);
  if (!modalidade) {
    return res.status(404).json({ erro: 'modalidade não encontrado' });
  }
  res.json(modalidade);
}

// POST /api/modalidades
export function criar(req, res) {
  // req.body vem vazio (undefined) se o cliente não enviar JSON; ?? {} evita o erro
  const { nome } = req.body ?? {};
  if (!nome) {
    return res.status(400).json({ erro: 'O campo titulo é obrigatório' });
  }
  const novoId = modalidades.length > 0 ? modalidades[modalidades.length - 1].id + 1 : 1;
  const novo = {
    id: novoId,
    nome,
  };
  modalidades.push(novo);
  res.status(201).json(novo);
}

// PUT /api/modalidades/:id
export function atualizar(req, res) {
  const id = Number(req.params.id);
  const posicao = modalidades.findIndex((m) => m.id === id);
  if (posicao === -1) {
    return res.status(404).json({ erro: 'modalidade não encontrado' });
  }
  const dados = req.body ?? {};
  if (dados.titulo === '') {
    return res.status(400).json({ erro: 'O campo titulo não pode ficar vazio' });
  }
  // junta o que já existia com o que chegou; o id nunca muda
  const atualizado = { ...modalidades[posicao], ...dados, id };
  modalidades[posicao] = atualizado;
  res.json(atualizado);
}

// DELETE /api/chamados/:id
export function excluir(req, res) {
  const id = Number(req.params.id);
  const posicao = modalidades.findIndex((m) => m.id === id);
  if (posicao === -1) {
    return res.status(404).json({ erro: 'modalidade não encontrado' });
  }
  modalidades.splice(posicao, 1);
  res.status(204).send();
}