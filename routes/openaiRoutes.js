import express from "express";
import { chatbotController } from "../controllers/openaiController.js";

const router = express.Router();

//route
router.post("/chatbot", chatbotController);

export default router;