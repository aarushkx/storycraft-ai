import { Router } from "express";
import {
    generateStory,
    generateImagePrompts,
} from "../controllers/ollama.controller.js";

const router = Router();

router.post("/generate-story", generateStory);
router.post("/generate-image-prompts", generateImagePrompts);

export default router;
