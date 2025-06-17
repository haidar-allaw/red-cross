// routes/location.routes.js
import express from 'express';
import { createLocation, listLocations } from '../controllers/location.controller.js';
const router = express.Router();

router.post('/', createLocation);
router.get ('/', listLocations);

export default router;
