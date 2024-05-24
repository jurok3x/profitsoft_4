import type {
    CommentCountRequestDto,
    CommentCountResponseDto,
    CommentDto,
    CommentSaveDto,
    FindByArticleIdRequestDto,
} from "../types/types.ts";

export interface ICommentService {
    /**
     * Finds comments by article ID.
     * @param {FindByArticleIdRequestDto} params - The parameters for finding comments includes articleId and pagination.
     * @returns {Promise<CommentDto[]>} The comments.
     * @throws {InternalError} If the article ID is not provided.
     */
    findByArticleId(data: FindByArticleIdRequestDto): Promise<CommentDto[]>;

    /**
     * Saves a new comment.
     * @param {CommentSaveDto} request - The request data for saving a comment.
     * @returns {Promise<CommentDto>} The saved comment.
     * @throws {InternalError} If the article does not exist or provided request data are not valid.
     */
    save(
        request: CommentSaveDto,
    ): Promise<CommentDto>;

    /**
     * Gets the count of comments for multiple articles.
     * @param {CommentCountRequestDto} params - The string array of articles id.
     * @returns {Promise<CommentCountResponseDto>} The comment counts.
     * @throws {InternalError} If the request format is invalid.
     */
    getCount(data: CommentCountRequestDto): Promise<CommentCountResponseDto>;
}