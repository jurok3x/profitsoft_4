import chai from 'chai';
import sinon from 'sinon';
import type { CommentSaveDto } from 'src/dto/comment/commentSaveDto.type';
import Comment from 'src/model/comment';
import * as commentService from 'src/services/comments';
import { comments } from '../config/commentsConfig';
import mongoSetup from '../mongoSetup';

const { expect } = chai;

const sandbox = sinon.createSandbox();

const data = comments;

describe('Comment Service', () => {
    before(async () => {
        await mongoSetup;
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it('createComment should create a new comment and return it', (done) => {
        const saveRequest: CommentSaveDto = {
            text: 'Great!',
            author: 'John Doe',
            articleId: '7f94d3da-a46a-4a90-a3d3-edbe4311dd83',
        }
        let createdCommentId: string;
        const articleExistsStub = sandbox.stub(commentService, 'checkArticleExists');
        articleExistsStub.resolves(true);

        commentService.saveComment(saveRequest)
            .then(comment => {
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