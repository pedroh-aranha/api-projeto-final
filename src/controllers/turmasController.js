import { turmas } from "../data/turmas";

//get
export function listarTurmas (req, res) {
 res.json(turmas)
};