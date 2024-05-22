import bodyParser from 'body-parser';
import chai from 'chai';
import chaiHttp from 'chai-http';
import express from 'express';
import sinon from 'sinon';
import type { CommentSaveDto } from 'src/dto/comment/commentSaveDto.type';
import Comment from 'src/model/comment';
import routers from 'src/routers/comments';
import * as commentService from 'src/services/comments';
import { comments, seed } from '../config/commentsConfig';
import mongoSetup from '../mongoSetup';

const data = comments;

const { expect } = chai;

chai.use(chaiHttp);
chai.should();

const sandbox = sinon.createSandbox();

const app = express();

app.use(bodyParser.json({ limit: '1mb' }));
app.use('/', routers);

describe('Comment controller', () => {
    before(async () => {
        await mongoSetup;
        await seed();
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('should save the comment', (done) => {
        const request: CommentSaveDto = {
            text: 'Great!',
            author: 'John Doe',
            articleId: '7f94d3da-a46a-4a90-a3d3-edbe4311dd83',
        }

        const articleExistsStub = sandbox.stub(commentService, 'checkArticleExists');
        articleExistsStub.resolves(true);

        chai.request(app)
            .post('')
            .send(request)
            .end(async (_, res) => {
                await Comment.findByIdAndDelete(res.body._id);
                res.should.have.status(201);
                expect(res.body).to.have.property('text').that.is.a('string');
                expect(res.body).to.have.property('author').that.is.a('string');
                sandbox.assert.calledOnce(articleExistsStub);
            
                done();
            })
    });
    
    it('should list the comments', (done) => {
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
    
})