import { Router } from "express";

import {
    acharTodosDonosController,
    acharDonoPorIdController,
    criarDonoController,
    atualizarDonoController,
    deletarDonoController,
} from "../controllers/dono.controller";

const router = Router();

router.get("/dono", acharTodosDonosController);
router.get("/dono/:id", acharDonoPorIdController);
router.post("/dono/", criarDonoController);
router.patch("/dono/:id", atualizarDonoController);
router.delete("/dono/:id", deletarDonoController);

export default router;
