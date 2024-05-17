import type { CommentCountResponseDto } from 'src/dto/comment/commentCountResponseDto';
import type { CommentDto } from 'src/dto/comment/commentDto';
import type { CommentListRequestDto } from 'src/dto/comment/commentListRequestDto';
import type { CommentSaveDto } from 'src/dto/comment/commentSaveDto';
import Comment, { type IComment } from 'src/model/comment';

export const saveComment = async ({
    text,
    author,
    articleId,
}: CommentSaveDto): Promise<IComment> => {
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
        .limit(size);

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
