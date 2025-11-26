// invite routes removed — file kept for compatibility
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => res.status(410).json({ success: false, message: 'Invite feature removed' }));

export default router;
