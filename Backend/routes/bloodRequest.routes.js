import express from 'express';
import { createBloodRequest, getAllBloodRequests } from '../controllers/bloodRequest.controller.js';

const router = express.Router();

// POST /api/bloodRequest
router.post('/create', createBloodRequest);
router.get('/getAll', getAllBloodRequests);

export default router;
