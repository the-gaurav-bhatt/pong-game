import express from "express";
import path from "path";
import { fileURLToPath } from "url";
export const api = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

api.use(express.static(path.join(__dirname, "public")));
api.use("/", express.static("index.html"));
