import bodyParser from 'body-parser';
import chai from 'chai';
import chaiHttp from 'chai-http';
import express from 'express';
import { ObjectId } from 'mongodb';
import sinon from 'sinon';
import routers from 'src/routers/comments';
import mongoSetup from '../mongoSetup';

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
    });
    afterEach(() => {
        sandbox.restore();
    });
    
    it('should list the comments', (done) => {
        const response = [
            {
                _id: new ObjectId(),
                text: 'Great!',
                author: 'John Doe',
                articleId: '7f94d3da-a46a-4a90-a3d3-edbe4311dd83',
                date: new Date(),
            },
            {
                _id: new ObjectId(),
                text: 'Nice!',
                author: 'Keanu Reeves',
                articleId: '7f94d3da-a46a-4a90-a3d3-edbe4311dd83',
                date: new Date(),
            },
        ];

        chai.request(app)
            .get('')
            .query({articleId :'7f94d3da-a46a-4a90-a3d3-edbe4311dd83'})
            .end((_, res) => {
                res.should.have.status(200);
                expect(res.body).to.deep.equal(response);
        
                done();
            });
    });
})