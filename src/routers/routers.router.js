import express from "express";
import { register } from "../controllers/register.controller.js";
import { login } from "../controllers/login.js";
import { container } from "../controllers/container.controller.js";
import { testando } from "../middleware/middleware.js";

const router = express.Router();

router.use(testando)
router.post("/", login );
router.post("/cadastro" , register);
router.get("/conteudo", container);

export default router;