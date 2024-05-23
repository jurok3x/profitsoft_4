import { Request, Response } from 'express';
import httpStatus from 'http-status';
import log4js from 'log4js';
import { InternalError } from '../system/internalError';
import type { ICommentService } from './interfaces/ICommentService';
import type {
    CommentCountRequestDto,
    CommentSaveDto,
    FindByArticleIdRequestDto
} from "./types/types.ts";

class CommentController {

    public constructor(private commentService: ICommentService) {}

    public async saveComment(req: Request, res: Response) {
        try {
            const comment = await this.commentService.save(req.body as CommentSaveDto);

            res.status(httpStatus.CREATED).send(comment);
        } catch (err) {
            log4js.getLogger().error('Error saving comment.', err);
            this.handleError(res, err);
        }
    };

    public async findCommentsCount (req: Request, res: Response) {
        try {
            const commentsCount = await this.commentService.getCount(req.body as CommentCountRequestDto);

            res.status(httpStatus.OK).send(commentsCount);
        } catch (err) {
            log4js.getLogger().error('Error in finding comments count.', err);
            this.handleError(res, err);
        }
    };

    public async findCommentsByArticleId (req: Request, res: Response) {
        try {
            const { articleId, size, from } = req.query;
            const comments = await this.commentService.findByArticleId({ articleId, size, from } as FindByArticleIdRequestDto);
    
            res.status(httpStatus.OK).send(comments);
        } catch (err) {
            log4js.getLogger().error('Error in finding comments by article id.', err);
            this.handleError(res, err);
        }
    };

    private handleError(res: Response, err: Error) {
        if (err instanceof InternalError) {
            const { message, status } = err;
            res.status(status).send({ message });
        } else {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message || 'Internal server error.');
        }
    }

}

export { CommentController };
