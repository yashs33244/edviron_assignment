import express, { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { protect } from '../middlewares/auth';

const router: Router = express.Router();

// Register route
router.post('/register', register as any);

// Login route
router.post('/login', login as any);

// Get profile route (protected)
router.get('/profile', protect as any, getProfile as any);

export default router; 