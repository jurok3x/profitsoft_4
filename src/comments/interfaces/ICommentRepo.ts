import type { IComment } from "../comment.model";
import type {
    ArticleCommentCountDto,
    CommentCountRequestDto,
    CommentSaveDto,
    FindByArticleIdRequestDto
} from "../types/types.ts";

export interface ICommentRepo {
    /**
     * Finds comments by article ID with pagination and sorting.
     * @param {FindByArticleIdRequestDto} params - The parameters for finding comments.
     * @returns {Promise<IComment[]>} The comments.
     */
    findByArticleId(data: FindByArticleIdRequestDto): Promise<IComment[]>;

    /**
     * Saves a new comment.
     * @param {CommentSaveDto} request - The request data for saving a comment.
     * @returns {Promise<IComment>} The saved comment.
     */
    save(comment: CommentSaveDto): Promise<IComment>;

    /**
     * Gets the count of comments for multiple articles.
     * @param {CommentCountRequestDto} params - The array of articles id.
     * @returns {Promise<ArticleCommentCountDto[]>} The comment counts.
     */
    getCount(data: CommentCountRequestDto): Promise<ArticleCommentCountDto[]>;
}
