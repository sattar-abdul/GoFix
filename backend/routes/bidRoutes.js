import express from "express";
import { placeBid, selectBid } from "../controllers/bidController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Provider places bid
router.post("/place", auth, placeBid);

// User selects bid
router.put("/select", auth, selectBid);

export default router;
