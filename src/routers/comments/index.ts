import express from 'express';
import { commentController } from '../../comments/comment';


const router = express.Router();

router.post('', commentController.saveComment);
router.post('/_counts', commentController.findCommentsCount);
router.get('', commentController.findCommentsByArticleId);

export default router;
