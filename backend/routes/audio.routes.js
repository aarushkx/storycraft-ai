import { Router } from "express";
import {
    generateAudio,
    getAudio,
    getSupportedVoices,
} from "../controllers/audio.controller.js";

const router = Router();

router.post("/generate", generateAudio);
router.get("/", getAudio);
router.get("/supported-voices", getSupportedVoices);

export default router;
