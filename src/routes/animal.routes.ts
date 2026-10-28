import { Router } from "express";

import {
    acharTodosAnimaisController,
    acharAnimalPorIdController,
    criarAnimalController,
    atualizarAnimalController,
    deletarAnimalController,
} from "../controllers/animal.controller";

const router = Router();

router.get("/animais", acharTodosAnimaisController);
router.get("/animais/:id", acharAnimalPorIdController);
router.post("/animais/", criarAnimalController);
router.patch("/animais/:id", atualizarAnimalController);
router.delete("/animais/:id", deletarAnimalController);

export default router;
