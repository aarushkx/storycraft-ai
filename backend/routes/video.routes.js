import { Router } from "express";
import { generateVideo, getVideo } from "../controllers/video.controller.js";

const router = Router();

router.post("/generate", generateVideo);
router.get("/", getVideo);

export default router;
