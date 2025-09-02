import express from 'express';
import handleBulk from '../controllers/bulkController.js';

export const bulkRouter = express.Router();

// Default route to render the bulk page
bulkRouter.get('/:bulkIP', handleBulk);
