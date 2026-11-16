import { turmas } from "../data/turmas.js";

//get
export function listarTurmas (req, res) {
 res.json(turmas)
};