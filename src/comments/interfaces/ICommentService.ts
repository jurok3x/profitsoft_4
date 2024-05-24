import type {
    CommentCountRequestDto,
    CommentCountResponseDto,
    CommentDto,
    CommentSaveDto,
    FindByArticleIdRequestDto,
} from "../types/types.ts";

export interface ICommentService {
    findByArticleId(data: FindByArticleIdRequestDto): Promise<CommentDto[]>;
    save(
        request: CommentSaveDto,
    ): Promise<CommentDto>;
    getCount(data: CommentCountRequestDto): Promise<CommentCountResponseDto>;
}