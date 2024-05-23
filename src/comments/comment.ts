import { articleClient } from '../client/client';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

const commentRepository = new CommentRepository();

const commentService = new CommentService(commentRepository, articleClient);

const commentController = new CommentController(commentService);

export { commentController, commentRepository, commentService };
