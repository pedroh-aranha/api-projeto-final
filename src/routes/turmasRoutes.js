import { Router } from "express";
import{ listarTurmas } from '../controllers/turmasController.js'

const router = Router();

router.get('/', listarTurmas);

export default router;