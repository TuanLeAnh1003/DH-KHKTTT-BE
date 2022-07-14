import express from 'express';
import { getAllUsers, deleteUser, getUserById } from '../controllers/users.js'
import { verifyToken } from '../controllers/middleware.js';

const router = express.Router();

// Get user by id
router.get('/:userId', getUserById)

// Get all users
router.get('/', verifyToken,  getAllUsers);

// Delete user
router.delete('/:id', deleteUser);

export default router;