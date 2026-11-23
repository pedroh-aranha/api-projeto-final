import { Router } from "express";
import { listar, buscarPorId, atualizar, criar, excluir } from '../controllers/modalidadesController.js'

const router = Router();

router.get('/', listar);
router.get('/:id', buscarPorId);
router.put('/:id', atualizar)
router.post('/', criar);
router.delete('/:id', excluir);

export default router;