import { Router } from "express";

const router = Router();

router.get("/dono");
router.get("/dono/:id");
router.post("/dono/");
router.patch("/dono/:id");
router.delete("/dono/:id");

export default router;
