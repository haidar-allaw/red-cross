import express from 'express';
import {
    createBloodRequest,
    getAllBloodRequests,
    getBloodRequestsByCenter,
    approveBloodRequest,
    rejectBloodRequest,
    getUserBloodRequests
} from '../controllers/bloodRequest.controller.js';

const router = express.Router();

// POST /api/bloodRequest
router.post('/create', createBloodRequest);
router.get('/getAll', getAllBloodRequests);
router.get('/center/:centerId', getBloodRequestsByCenter);
router.get('/user/:userId', getUserBloodRequests);
router.patch('/:id/approve', approveBloodRequest);
router.patch('/:id/reject', rejectBloodRequest);

export default router;
