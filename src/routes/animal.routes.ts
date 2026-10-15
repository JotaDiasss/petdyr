import { Router } from "express";

const router = Router();

router.get("/animais");
router.get("/animais/:id");
router.post("/animais/");
router.patch("/animais/:id");
router.delete("/animais/:id");

export default router;
