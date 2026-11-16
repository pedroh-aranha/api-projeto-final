import { usuarios } from '../data/usuarios.js';

//get 
export function listarUsuarios (req, res) {
  res.json(usuarios);
};

