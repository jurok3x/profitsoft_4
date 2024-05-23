import type { IArticleClient } from '../client/interfaces/IArticleClient';
import type { IComment } from "./comment.model.ts";
import type { ICommentRepo } from "./interfaces/ICommentRepo";
import type { ICommentService } from "./interfaces/ICommentService";
import type {
    CommentCountRequestDto,
    CommentCountResponseDto,
    CommentDto,
    CommentSaveDto,
    FindByArticleIdRequestDto,
} from "./types/types.ts";

class CommentService implements ICommentService {
    public constructor(
        private commentRepository: ICommentRepo,
        private articleClient: IArticleClient,
    ){}

    public async findByArticleId({
        articleId,
        from,
        size,
    }: FindByArticleIdRequestDto): Promise<CommentDto[] | null> {
        if (!articleId) {
            return null;
        }
    
        const comments = await this.commentRepository.findByArticleId({ articleId, from, size });
        return comments.map(this.toCommentDto);
    }

    public async save(request: CommentSaveDto): Promise<CommentDto> {
        const { articleId } = request;
        const articleExists = await this.articleClient.checkArticleExists(articleId);

        if (!articleExists) {
            throw new Error(`Article with ID ${articleId} does not exist.`);
        }

        const comment = await this.commentRepository.save(request);

        return this.toCommentDto(comment);
    }
    
    public async getCount({ articleIds }: CommentCountRequestDto): Promise<CommentCountResponseDto> {
        if (!Array.isArray(articleIds) || !articleIds.every(id => typeof id === 'string')) {
            throw new Error('Invalid articleIds format. Must be an array of strings.');
        }

        const commentCounts = await this.commentRepository.getCount({ articleIds });
        const commentCountMap = new Map(commentCounts.map((item: { _id: string, count: number }) => [item._id, item.count]));
        const response: CommentCountResponseDto = {};
        articleIds.forEach(articleId => {
            response[articleId] = commentCountMap.get(articleId) || 0;
        });
    
        return response;
    }

    private toCommentDto = (comment: IComment): CommentDto => {
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
}

export { CommentService };
