import { usuarios } from '../data/turmas.js';

//get 
export function listarUsuarios (req, res) {
  res.json(usuarios);
};

