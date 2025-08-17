import express from 'express';
import {getStatus, renderStatus, getToday, getWeek, getMonth} from '../controllers/statusController.js';

export const statusRouter = express.Router();

// Default route to render the status page
statusRouter.get('/', renderStatus);
statusRouter.get('/data', getStatus);
statusRouter.get('/today', getToday);
statusRouter.get('/week', getWeek);
statusRouter.get('/month', getMonth);
