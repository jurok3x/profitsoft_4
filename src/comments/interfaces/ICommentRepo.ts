import type { IComment } from "../comment.model";
import type {
    ArticleCommentCountDto,
    CommentCountRequestDto,
    CommentSaveDto,
    FindByArticleIdRequestDto
} from "../types/types.ts";

export interface ICommentRepo {
    findByArticleId(data: FindByArticleIdRequestDto): Promise<IComment[]>;
    save(comment: CommentSaveDto): Promise<IComment>;
    getCount(data: CommentCountRequestDto): Promise<ArticleCommentCountDto[]>;
}
