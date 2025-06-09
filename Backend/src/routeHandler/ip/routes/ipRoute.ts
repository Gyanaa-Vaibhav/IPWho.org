import express,{Request,Response} from 'express';
import { renderIp } from '../controllers/ipController.js';

export const ipRouter = express.Router();

// Default route to render the ip page
ipRouter.get('/', (req:Request,res:Response) => {
    const ip = req.params.ip;

    if(!ip){
        res.statusCode = 404;
        res.json({ success:false, message:"Invalid IP address" })
        return
    }
});
ipRouter.get('/:ip', renderIp);
