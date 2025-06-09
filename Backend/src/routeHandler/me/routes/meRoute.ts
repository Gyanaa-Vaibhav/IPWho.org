import express from 'express';
import { renderMe } from '../controllers/meController.js';

export const meRouter = express.Router();

// Default route to render the, me page
meRouter.get('/', renderMe);
