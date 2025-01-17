import express from 'express';
import ping from '../ping/ping';
import comments from './comments';

const router = express.Router();

router.get('/ping', ping);

router.use('/comments', comments);

export default router;
