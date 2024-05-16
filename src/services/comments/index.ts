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