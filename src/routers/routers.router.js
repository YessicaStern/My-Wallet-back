import express from "express";
import { login } from "../controllers/login.controller.js";
import { register } from "../controllers/register.controller.js";
import { container,newEntry, newExit } from "../controllers/container.controller.js";

const router = express.Router();

router.post("/", login);
router.post("/cadastro" , register);
router.get("/movimentacoes", container);
router.post("/movimentacoes-entrada", newEntry);
router.post("/movimentacoes-saida", newExit);

export default router;