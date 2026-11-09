import { Router } from "express";
import { listarUsuarios } from "../controllers/usuariosController";

const router = Router();

router.get('/usuarios', listarUsuarios);

export default router;