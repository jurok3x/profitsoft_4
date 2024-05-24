import bodyParser from 'body-parser';
import chai from 'chai';
import chaiHttp from 'chai-http';
import express from 'express';
import httpStatus from 'http-status';
import sinon from 'sinon';
import type { ArticleClient } from 'src/client/articleClient';
import { articleClient } from 'src/client/client';
import Comment from 'src/comments/comment.model';
import type { CommentSaveDto } from 'src/comments/types/commentSaveDto.type';
import routers from 'src/routers/comments';
import { comments, seed } from '../config/commentsConfig';
import mongoSetup from '../mongoSetup';

const data = comments;

const { expect } = chai;

chai.use(chaiHttp);
chai.should();

const app = express();

app.use(bodyParser.json({ limit: '1mb' }));
app.use('/', routers);

describe('Comment controller', () => {
    let clientStub: sinon.SinonStubbedInstance<ArticleClient>;
    
    before(async () => {
        await mongoSetup;
        await seed();
    });
    beforeEach(() => {
        clientStub = sinon.stub(articleClient);
    });
    afterEach(() => {
        sinon.restore();
    });

    it('should save the comment', (done) => {
        const request: CommentSaveDto = {
            text: 'Great!',
            author: 'John Doe',
            articleId: '7f94d3da-a46a-4a90-a3d3-edbe4311dd83',
        }

        clientStub.checkArticleExists.resolves(true);

        chai.request(app)
            .post('')
            .send(request)
            .end(async (_, res) => {
                await Comment.findByIdAndDelete(res.body._id);
                res.should.have.status(httpStatus.CREATED);
                expect(res.body).to.have.property('_id').that.is.a('string');
                expect(res.body).to.have.property('text').that.is.a('string');
                expect(res.body).to.have.property('author').that.is.a('string');
            
                done();
            })
    });

    it('should fail saving comment when article not found', (done) => {
        const request: CommentSaveDto = {
            text: 'Great!',
            author: 'John Doe',
            articleId: '7f94d3da-a46a-4a90-a3d3-edbe4311dd83',
        }

        clientStub.checkArticleExists.resolves(false);

        chai.request(app)
            .post('')
            .send(request)
            .end(async (_, res) => {
                res.should.have.status(httpStatus.BAD_REQUEST);
                expect(res.body).to.have.property('message').eql(`Article with ID ${request.articleId} does not exist`);
            
                done();
            })
    });

    it('should fail saving comment when author is blank', (done) => {
        const request: CommentSaveDto = {
            text: 'Great!',
            author: ' ',
            articleId: '7f94d3da-a46a-4a90-a3d3-edbe4311dd83',
        }

        clientStub.checkArticleExists.resolves(true);

        chai.request(app)
            .post('')
            .send(request)
            .end(async (_, res) => {
                res.should.have.status(httpStatus.BAD_REQUEST);
                expect(res.body).to.have.property('message').eql(`Comment validation failed: author:   should not be empty`);
            
                done();
            })
    });
    
    it('should return list of comments when find by id', (done) => {
        const response = data.map(item => ({
            _id: item.id,
            text: item.text,
            author: item.author,
            articleId: item.articleId,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
            deletedAt: item.deletedAt ? item.deletedAt.toISOString() : null,
        }))

        chai.request(app)
            .get('')
            .query({articleId :'7f94d3da-a46a-4a90-a3d3-edbe4311dd83'})
            .end((_, res) => {
                res.should.have.status(200);
                expect(res.body).to.be.an('array').with.lengthOf(2);
                expect(res.body).to.deep.equal(response);
        
                done();
            });
    });

    it('should throw error when article id undefined', (done) => {

        chai.request(app)
            .get('')
            .end((_, res) => {
                res.should.have.status(400);
                expect(res.body).to.have.property('message').eql('Article ID must be defined.');
        
                done();
            });
    });

    it('should return the comments count', (done) => {
        const request = {
            "articleIds": ["7f94d3da-a46a-4a90-a3d3-edbe4311dd83", "7f94d3da-a46a-4a90-a3d3-edbe4311dd82"]
        };

        chai.request(app)
            .post('/_counts')
            .send(request)
            .end((_, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('7f94d3da-a46a-4a90-a3d3-edbe4311dd82').that.is.a('number');
                expect(res.body).to.have.property('7f94d3da-a46a-4a90-a3d3-edbe4311dd83').that.is.a('number');
        
                done();
            });
    });

    it('should throw error when request list is not an array', (done) => {
        chai.request(app)
            .post('/_counts')
            .send('definitely not an array')
            .end((_, res) => {
                res.should.have.status(400);
                expect(res.body).to.have.property('message').eql('Invalid articleIds format. Must be an array of strings.');
        
                done();
            });
    });
    
})