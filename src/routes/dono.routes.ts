import { Router } from "express";

import {
    acharTodosDonosController,
    acharDonoPorIdController,
    criarDonoController,
    atualizarDonoController,
    deletarDonoController,
} from "../controllers/dono.controller";

const router = Router();

router.get("/dono");
router.get("/dono/:id");
router.post("/dono/");
router.patch("/dono/:id");
router.delete("/dono/:id");

export default router;
