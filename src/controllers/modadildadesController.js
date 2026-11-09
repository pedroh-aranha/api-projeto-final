import { modalidades } from "../data/modalidades";

//get
export function listarModalidades (req, res) {
  res.json(modalidades)
};
