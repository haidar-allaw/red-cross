// routes/medicalcenter.routes.js
import express from "express";
import {
  signupCenter,
  loginCenter,
  listApprovedCenters,
  listAllCenters,
  getCenterById,
  approveCenter,
  getCenterCount,
  getPendingCount,
} from "../controllers/centers.controller.js";

const router = express.Router();

// Public endpoints
router.post("/signup", signupCenter);
router.post("/login", loginCenter);

// Listing endpoints
router.get("/", listApprovedCenters);
router.get("/all", listAllCenters);
router.get("/count", getCenterCount);
router.get("/pendingCount", getPendingCount);
// Detail & actions
router.get("/:id", getCenterById);
router.patch("/:id/approve", approveCenter);

export default router;
