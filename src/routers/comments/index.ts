import express from 'express';
import {
  saveComment,
} from 'src/controllers/comments';

const router = express.Router();

router.post('', saveComment);

export default router;
