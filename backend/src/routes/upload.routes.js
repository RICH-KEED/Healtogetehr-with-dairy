import express from "express";
import { getImageKitAuthParams, uploadAudio } from "../controllers/upload.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

// Route to get ImageKit authentication parameters
router.get("/", protectRoute, getImageKitAuthParams);

// Route to upload audio
router.post("/audio", protectRoute, uploadAudio);

export default router;
