import express from 'express';
import { renderMetrics } from '../controllers/metricsController.js';

export const metricsRouter = express.Router();

// Default route to render the metrics page
metricsRouter.get('/', renderMetrics);
