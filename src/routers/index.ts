import express from 'express';
import ping from 'src/controllers/ping';
import comments from './comments';
import groups from './groups';
import students from './students';

const router = express.Router();

router.get('/ping', ping);

router.use('/groups', groups);
router.use('/students', students);
router.use('/comments', comments);

export default router;
