import chai from 'chai';
import sinon from 'sinon';
import type { ArticleClient } from 'src/client/articleClient';
import { articleClient } from 'src/client/client';
import { commentRepository, commentService } from 'src/comments/comment';
import type { CommentRepository } from 'src/comments/comment.repository';
import type { CommentSaveDto } from 'src/comments/types/commentSaveDto.type';
import type { InternalError } from 'src/system/internalError';
import { comments } from '../config/commentsConfig';

const { expect, assert } = chai;

const data = comments;

describe('Comment Service', () => {
    const saveRequest: CommentSaveDto = {
        text: 'Great!',
        author: 'John Doe',
        articleId: '7f94d3da-a46a-4a90-a3d3-edbe4311dd83',
    }

    let clientStub: sinon.SinonStubbedInstance<ArticleClient>;
    let repoStub: sinon.SinonStubbedInstance<CommentRepository>
    beforeEach(async () => {
        clientStub = sinon.stub(articleClient);
        repoStub = sinon.stub(commentRepository)
    });

    afterEach(async () => {
        sinon.restore();
    });

    it('createComment should create a new comment and return it', (done) => {
        repoStub.save.resolves(data[0]);
        clientStub.checkArticleExists.resolves(true);

        commentService.save(saveRequest)
            .then(comment => {
                expect(comment).to.exist;
                expect(comment?.text).to.equal(saveRequest.text);
                expect(comment?.author).to.equal(saveRequest.author);
                expect(comment?.articleId).to.equal(saveRequest.articleId);

                done();
            })
            .catch((error: Error) => done(error))
    });

    it('createComment should throw an error when article not found', async () => {
        clientStub.checkArticleExists.resolves(false);

        try {
            await commentService.save(saveRequest);
            assert.fail('Expected saveComment to throw an error');
        } catch (error){
            const httpError = error as InternalError;
            expect(httpError.message).is.equal(`Article with ID ${saveRequest.articleId} does not exist`);
        }
    });

    it('findComment should return valid comments', (done) => {
        const { articleId } = data[0];
        const size = 10;
        const from = 0;
        repoStub.findByArticleId.resolves(data);

        commentService.findByArticleId({ articleId, size, from })
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
        const { articleId } = data[0];
        const articleIds = [...articleId, '7f94d3da-a46a-4a90-a3d3-edbe4311dd82'];
        const [firstArticleId, secondArticleId] = articleIds;
        
        repoStub.getCount.resolves([{ _id: articleIds[0], count: 2 }]);
        commentService.getCount({ articleIds })
            .then(counts => {
                expect(counts).to.haveOwnProperty(articleIds[0]);
                expect(counts).to.haveOwnProperty(articleIds[1]);
                expect(counts[firstArticleId]).to.equal(2);
                expect(counts[secondArticleId]).to.equal(0);

                done();
            })
            .catch((error: Error) => done(error));
    });
});