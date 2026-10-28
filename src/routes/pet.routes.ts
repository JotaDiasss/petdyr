import { Router } from "express";

import {
    acharTodosPetsController,
    acharPetPorIdController,
    criarPetController,
    atualizarPetController,
    deletarAnimalController,
} from "../controllers/pet.controller";

const router = Router();

router.get  ("/pet", acharTodosPetsController);
router.get  ("/pet/:id", acharPetPorIdController);
router.post ("/pet/", criarPetController);
router.patch("/pet/:id", atualizarPetController);
router.delete("/pet/:id", deletarAnimalController);

export default router;
