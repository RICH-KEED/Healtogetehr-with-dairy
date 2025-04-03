import express from "express";
import authRoutes from "./auth.routes.js";
import messageRoutes from "./message.routes.js";
import groupRoutes from "./group.routes.js";
import adminRoutes from "./admin.routes.js";
import auraRoutes from "./aura.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = express.Router();

// API routes
router.use("/auth", authRoutes);
router.use("/messages", messageRoutes);
router.use("/groups", groupRoutes);
router.use("/admin", adminRoutes);
router.use("/aura", auraRoutes);
router.use("/upload", uploadRoutes);

export default router;
