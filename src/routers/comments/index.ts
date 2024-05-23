import express from 'express';
import { commentController } from '../../comments/comment';


const router = express.Router();

router.post('', (req, res) => commentController.saveComment(req, res));
router.post('/_counts', (req, res) => commentController.findCommentsCount(req, res));
router.get('', (req, res) => commentController.findCommentsByArticleId(req, res));

export default router;
