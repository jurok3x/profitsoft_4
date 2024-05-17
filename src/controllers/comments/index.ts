import { Request, Response } from 'express';
import httpStatus from 'http-status';
import log4js from 'log4js';
import type { CommentSaveDto } from 'src/dto/comment/commentSaveDto';
import {
    countCommentsByArticleId,
    listCommentsByArticleId,
    saveComment as saveCommentApi,
} from 'src/services/comments';
import { InternalError } from 'src/system/internalError';

export const saveComment = async (req: Request, res: Response) => {
    try {
        const { body: request } = req;
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

export const findCommentsByArticleId = async (req: Request, res: Response) => {
    try {
        const { query } = req;
        const { articleId, size, from } = query;
        const parsedArticleId = articleId as string;
        const parsedSize = parseInt(size as string, 10) || 10;
        const parsedFrom = parseInt(from as string, 10) || 0

        const comments = await listCommentsByArticleId({
            articleId: parsedArticleId,
            size: parsedSize,
            from: parsedFrom,
        });

        res.status(httpStatus.OK).send(comments);
    } catch (err) {
        const { message, status } = new InternalError(err);
        log4js.getLogger().error('Error in creating group.', err);
        res.status(status).send({ message });
    }
};

export const findCommentsCount = async (req: Request, res: Response) => {
    try {
        const { body } = req;
        const { articleIds } = body;
        if (!Array.isArray(articleIds) || !articleIds.every(id => typeof id === 'string')) {
            return res.status(httpStatus.BAD_REQUEST).send({ message: 'Invalid articleIds format. Must be an array of strings.' });
        }

        const comments = await countCommentsByArticleId(articleIds);
        res.status(httpStatus.OK).send(comments);
    } catch (err) {
        const { message, status } = new InternalError(err);
        log4js.getLogger().error('Error in creating group.', err);
        res.status(status).send({ message });
    }
};