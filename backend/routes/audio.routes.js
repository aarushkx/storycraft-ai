import { Router } from "express";
import {
    generateAudio,
    generateSubtitle,
    getAudio,
    getSupportedVoices,
} from "../controllers/audio.controller.js";

const router = Router();

router.post("/generate", generateAudio);
router.post("/generate-subtitle", generateSubtitle);
router.get("/", getAudio);
router.get("/supported-voices", getSupportedVoices);

export default router;
