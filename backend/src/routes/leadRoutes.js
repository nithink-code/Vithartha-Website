import express from 'express';
import { createLead, getLeads, updateLead } from '../controllers/leadController.js';

const router = express.Router();

router.post('/', createLead);
router.get('/', getLeads);
router.patch('/:id', updateLead);

export default router;
