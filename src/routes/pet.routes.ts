import { Router } from "express";

const router = Router();

router.get  ("/pet");
router.get  ("/pet/:id");
router.post ("/pet/");
router.patch("/pet/:id");
router.delete("/pet/:id");

export default router;
