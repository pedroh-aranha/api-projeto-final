import { usuarios } from '../data/turmas';

//get 
export function listarUsuarios (req, res) {
  res.json(usuarios);
};

