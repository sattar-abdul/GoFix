import express from "express";
import upload from "../middleware/upload.js";
import { analyzeImage} from "../controllers/aiController.js";

const router = express.Router();

router.post("/analyze-image", upload.single("image"), analyzeImage);



export default router;
