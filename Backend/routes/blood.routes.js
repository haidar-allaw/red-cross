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
  getHospitalDonationStats
} from "../controllers/blood.controller.js";

const router = express.Router();

// Blood donation endpoints
router.post("/donate", createBloodEntry);

// Blood entry management endpoints
router.get("/", getAllBloodEntries);
router.get("/stats", getBloodStats);
router.get("/hospital-donations", getHospitalDonationStats);
router.get("/center/:centerId", getBloodEntriesByCenter);
router.get("/:id", getBloodEntryById);
router.put("/:id", updateBloodEntry);
router.delete("/:id", deleteBloodEntry);

export default router; 