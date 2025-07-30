import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import ollamaRoutes from "./routes/ollama.routes.js";

const app = express();

const CLIENT_URL = "http://localhost:3000";

app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/ollama", ollamaRoutes);

export { app };
