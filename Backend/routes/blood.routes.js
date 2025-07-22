// routes/blood.routes.js
import express from "express";
import {
  createBloodEntry,
  getAllBloodEntries,
  getBloodEntryById,
  updateBloodEntry,
  deleteBloodEntry,
  getBloodStats,
  getBloodEntriesByCenter,
  getHospitalDonationStats,
  testBloodEntries,
  cleanupBloodEntries,
  completeDonation,
  cancelDonation
} from "../controllers/blood.controller.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

// Blood donation endpoints
router.post("/donate",authenticate, createBloodEntry);
router.post("/:id/complete", completeDonation);
router.patch("/:id/cancel", cancelDonation);

// Blood entry management endpoints
router.get("/", getAllBloodEntries);
router.get("/stats", getBloodStats);
router.get("/test", testBloodEntries);
router.get("/hospital-donations", getHospitalDonationStats);
router.get("/center/:centerId", getBloodEntriesByCenter);
router.delete("/cleanup", cleanupBloodEntries);
router.get("/:id", getBloodEntryById);
router.put("/:id", updateBloodEntry);
router.delete("/:id", deleteBloodEntry);

export default router; 