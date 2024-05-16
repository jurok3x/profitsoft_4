import { Request, Response } from 'express';
import httpStatus from 'http-status';
import log4js from 'log4js';
import type { CommentSaveDto } from 'src/dto/comment/commentSaveDto';
import {
    saveComment as saveCommentApi,
} from 'src/services/comments';
import { InternalError } from 'src/system/internalError';

export const saveComment = async (req: Request, res: Response) => {
    try {
        const request = req.body ;
        const { text, articleId, author } = request as CommentSaveDto;
        const comment = await saveCommentApi({
            text,
            author,
            articleId,
        });
        res.status(httpStatus.CREATED).send(comment);
    } catch (err) {
        const { message, status } = new InternalError(err);
        log4js.getLogger().error('Error in creating group.', err);
        res.status(status).send({ message });
    }
};