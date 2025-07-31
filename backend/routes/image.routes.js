import { Router } from "express";
import { selectImage } from "../controllers/image.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/select", upload.single("image"), selectImage);

export default router;
