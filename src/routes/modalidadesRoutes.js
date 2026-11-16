import { Router } from "express";
import { listarModalidades, buscarPorId, atualizar, criar, excluir } from '../controllers/modalidadesController.js'

const router = Router();

router.get('/', listarModalidades);
router.get('/:id', buscarPorId);
router.put('/:id', atualizar)
router.post('/', criar);
router.delete('/:id', excluir);

export default router;