import { Router } from "express";
import { getLlamaResponse } from "../controllers/ollama.controller.js";

const router = Router();

router.post("/generate", getLlamaResponse);

export default router;
