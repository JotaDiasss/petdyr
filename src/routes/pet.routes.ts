import { Router } from "express";

import {
    acharTodosPetsController,
    acharPetPorIdController,
    criarPetController,
    atualizarPetController,
    deletarAnimalController,
} from "../controllers/pet.controller";

const router = Router();

router.get  ("/pet");
router.get  ("/pet/:id");
router.post ("/pet/");
router.patch("/pet/:id");
router.delete("/pet/:id");

export default router;
