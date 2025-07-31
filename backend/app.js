import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

import ollamaRoutes from "./routes/ollama.routes.js";
import imageRoutes from "./routes/image.routes.js";
import audioRoutes from "./routes/audio.routes.js";
import videoRoutes from "./routes/video.routes.js";

const app = express();

const CLIENT_URL = "http://localhost:3000";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/bucket", express.static(path.join(__dirname, "bucket")));
app.use(cookieParser());

app.use("/api/v1/ollama", ollamaRoutes);
app.use("/api/v1/image", imageRoutes);
app.use("/api/v1/audio", audioRoutes);
app.use("/api/v1/video", videoRoutes);

export { app };
