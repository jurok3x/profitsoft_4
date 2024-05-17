import express from 'express';
import {
  findCommentsByArticleId,
  findCommentsCount,
  saveComment,
} from 'src/controllers/comments';

const router = express.Router();

router.post('', saveComment);
router.post('/_counts', findCommentsCount);
router.get('', findCommentsByArticleId);

export default router;
