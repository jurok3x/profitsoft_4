export type CommentDto = {
	_id: string,
	text: string,
    articleId: string,
	author: string,
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date;
}