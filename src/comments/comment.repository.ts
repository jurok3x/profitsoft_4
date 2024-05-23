import Comment, { type IComment } from 'src/comments/comment.model';
import type { ICommentRepo } from "./interfaces/ICommentRepo";
import type {
    ArticleCommentCountDto,
    CommentCountRequestDto,
    CommentSaveDto,
    FindByArticleIdRequestDto
} from "./types/types.ts";

class CommentRepository implements ICommentRepo {

    public async findByArticleId({
            articleId,
            from = 0,
            size = 10,
        }: FindByArticleIdRequestDto): Promise<IComment[]> {
        const comments = await Comment
            .find({
                articleId,
                deletedAt: null,
            })
            .skip(from)
            .limit(size)
            .sort('createdAt');
    
        return comments;
    }

    public async save({
        text,
        author,
        articleId,
    }: CommentSaveDto): Promise<IComment> {
        const comment = await new Comment({
            text,
            author,
            articleId,
        }).save();
    
        return comment;
    }

    public async getCount({ articleIds }: CommentCountRequestDto): Promise<ArticleCommentCountDto[]> {
        const commentCounts = await Comment.aggregate([
            { $match: { articleId: { $in: articleIds }, deletedAt: null } },
            { $group: { _id: "$articleId", count: { $sum: 1 } } }
        ]);

        return commentCounts;
    }
}

export { CommentRepository };
