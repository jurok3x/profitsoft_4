import chai from 'chai';
import sinon from 'sinon';
import Comment from 'src/comments/comment.model';
import type { CommentSaveDto } from 'src/comments/types/commentSaveDto.type';
import type { HttpError } from 'src/dto/error/httpError';
import * as commentService from 'src/services/comments';
import { comments } from '../config/commentsConfig';

const { expect, assert } = chai;

const sandbox = sinon.createSandbox();

const data = comments;
const saveRequest: CommentSaveDto = {
    text: 'Great!',
    author: 'John Doe',
    articleId: '7f94d3da-a46a-4a90-a3d3-edbe4311dd83',
}

describe('Comment Service', () => {
    afterEach(async () => {
        sandbox.restore();
    });

    it('createComment should create a new comment and return it', (done) => {
        
        let createdCommentId: string;
        const articleExistsStub = sandbox.stub(commentService, 'checkArticleExists');
        articleExistsStub.resolves(true);

        commentService.saveComment(saveRequest)
            .then(comment => {
                sandbox.assert.calledOnce(articleExistsStub);
                expect(comment).to.exist;
                expect(comment?.id).to.be.a('string');
                expect(comment?.text).to.equal(saveRequest.text);
                expect(comment?.author).to.equal(saveRequest.author);
                expect(comment?.articleId).to.equal(saveRequest.articleId);
                createdCommentId = comment?.id;

                done();
            })
            .catch((error: Error) => done(error))
            .finally( async () => {
                if (createdCommentId) {
                    await Comment.deleteOne({ _id: createdCommentId });
                }
            });
    });

    it('createComment should throw an error when article not found', async () => {
        const articleExistsStub = sandbox.stub(commentService, 'checkArticleExists');
        articleExistsStub.resolves(false);

        try {
            await commentService.saveComment(saveRequest);
            assert.fail('Expected saveComment to throw an error');
        } catch (error){
            const httpError = error as HttpError;
            expect(httpError.message).is.equal('Article with ID 7f94d3da-a46a-4a90-a3d3-edbe4311dd83 does not exist.');
        }
    });

    it('findComment should return valid comments', (done) => {
        const { articleId } = data[0];
        const size = 10;
        const from = 0;
        commentService.listCommentsByArticleId({ articleId, size, from })
            .then(comments => {
                expect(comments.length).to.equal(2);
                comments.forEach(comment => {
                    expect(comment).to.have.property('articleId').that.is.a('string');
                    expect(comment.articleId).to.equal(articleId);
                    
                    expect(comment).to.have.property('author').that.is.a('string');
                    expect(comment).to.have.property('text').that.is.a('string');
                    expect(comment).to.have.property('createdAt').that.is.a('date');
                    expect(comment).to.have.property('updatedAt').that.is.a('date');
                    expect(comment).to.have.property('deletedAt').that.is.a('null');
                })

                done();
            })
            .catch((error: Error) => done(error));
    });

    it('findCommentCount should return correct count', (done) => {
        const { articleId: firstArticleId } = data[0];
        const secondArticleId = '7f94d3da-a46a-4a90-a3d3-edbe4311dd82';
        const articleIds = [firstArticleId, secondArticleId];
        commentService.countCommentsByArticleId(articleIds)
            .then(counts => {
                expect(counts).to.haveOwnProperty(firstArticleId);
                expect(counts).to.haveOwnProperty(secondArticleId);
                expect(counts[firstArticleId]).to.equal(2);
                expect(counts[secondArticleId]).to.equal(0);

                done();
            })
            .catch((error: Error) => done(error));
    });
});