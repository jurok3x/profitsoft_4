export interface IArticleClient {
    checkArticleExists(articleId: string): Promise<boolean>;
}