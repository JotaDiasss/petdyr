import { Router } from "express";

import {
    acharTodosAnimaisController,
    acharAnimalPorIdController,
    criarAnimalController,
    atualizarAnimalController,
    deletarAnimalController,
} from "../controllers/animal.controller";

const router = Router();

router.get("/animais");
router.get("/animais/:id");
router.post("/animais/");
router.patch("/animais/:id");
router.delete("/animais/:id");

export default router;
