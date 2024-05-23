import axios from 'axios';
import Comment, { type IComment } from 'src/comments/comment.model';
import type { CommentCountResponseDto } from 'src/comments/types/commentCountResponseDto.type';
import type { CommentDto } from 'src/comments/types/commentDto.type';
import type { CommentListRequestDto } from 'src/comments/types/commentListRequestDto.type';
import type { CommentSaveDto } from 'src/comments/types/commentSaveDto.type';

const ARTICLE_API_URL = 'http://localhost:8080/api/v1/articles'; 

export const saveComment = async ({
    text,
    author,
    articleId,
}: CommentSaveDto): Promise<IComment> => {
    const articleExists = await checkArticleExists(articleId);

    if (!articleExists) {
        throw new Error(`Article with ID ${articleId} does not exist.`);
    }

    const comment = await new Comment({
        text,
        author,
        articleId,
    }).save();

    return comment;
};

export const listCommentsByArticleId = async (
    request: CommentListRequestDto
): Promise<CommentDto[]> => {
    const { articleId, from, size } = request;
    const comments = await Comment
        .find({
            articleId,
            deletedAt: null,
        })
        .skip(from)
        .limit(size)
        .sort('createdAt');

    return comments.map(comment => toCommentDto(comment));
};

export const countCommentsByArticleId = async (
    articleIds: string[]
): Promise<CommentCountResponseDto> => {
    const commentCounts = await Comment.aggregate([
        { $match: { articleId: { $in: articleIds }, deletedAt: null } },
        { $group: { _id: "$articleId", count: { $sum: 1 } } }
    ]);

    const commentCountMap = new Map(commentCounts.map((item: { _id: string, count: number }) => [item._id, item.count]));

    const response: CommentCountResponseDto = {};
    articleIds.forEach(articleId => {
        response[articleId] = commentCountMap.get(articleId) || 0;
    });

    return response;
};

const toCommentDto = (comment: IComment): CommentDto => {
    const {_id, text, author, articleId, createdAt, updatedAt, deletedAt } = comment;
    return {
        _id,
        text,
        author,
        articleId,
        createdAt,
        updatedAt,
        deletedAt,
    }
}

export const checkArticleExists = async (articleId: string): Promise<boolean> => {
    try {
        const response = await axios.get(`${ARTICLE_API_URL}/${articleId}`);
        return response.status === 200;
    } catch (error) {
        console.log(JSON.stringify(error))
        return false;
    }
};
