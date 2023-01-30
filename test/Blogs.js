import chai from "chai"
import chaiHttp from "chai-http"
import fs from "fs"
import path from "path"
import app from "../src/app"

chai.use(chaiHttp);
const { expect, assert } = chai;

describe("All Blogs API EndPoints",()=>{
    describe('GET  all blogs', () => {
        it('should return the expected response',(done) => {
           chai.request(app)
            .get('/blogs')
            .end((err, res) => {
              assert.isNull(err, 'Error should be null');
              assert.equal(res.status, 200, 'Status code should be 200');
              assert.isArray(res.body, 'Response body should be an Array');
              
              done();
            });
        });
    });
    describe('GET  all blogs //Negative test', () => {
        it('trying a wrong path and see is it returns NOT FOUND error',(done) => {
           chai.request(app)
            .get('/blog')
            .end((err, res) => {
              assert.equal(res.status, 404, 'Status code should be 404');
              done();
            });
        });
    });
    describe('GET  a single existing blog', () => {
        it('Should return a single blog',(done) => { 
            const id="63d7048624ba163524889a86";
           chai.request(app)
            .get('/blogs/'+id)
            .end((err, res) => {
                assert.isNull(err, 'Error should be null');
                assert.equal(res.status, 200, 'Status code should be 200');
                assert.isObject(res.body, 'Response body should be an Object');
              done();
            });
        });
    });
    describe('API which require admin Authorization', () => {
        let token;
        let userToken;
        let blogId;
        let commentId;
        it('Admin login',(done) => {
            
           chai.request(app)
            .post('/auth/admin/login')
            .send({ username: 'ngoma', password: 'ngoma' })
            .end((err, res) => {
              assert.isNull(err, 'Error should be null');
              assert.equal(res.status, 200, 'Status code should be 200');
              assert.isObject(res.body, 'Response body should be an Object');
              token=res.body.token;
              done();
            });
        });
        it('POST a new Blog, require admin Authorization',(done) => {
            
            chai.request(app)
             .post('/blogs')
             .set('Authorization', `Bearer ${token}`)
             .attach('image', fs.readFileSync(path.join(__dirname, 'med1.jpg')), 'med1.jpg')
             .field('article', 'Test')
             .field('category', 'Test')
             .field('content', 'Test')
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               blogId=res.body._id;
               done();
            });
        });
        it('Should return a single blog',(done) => {
           chai.request(app)
            .get('/blogs/'+blogId)
            .end((err, res) => {
              assert.isNull(err, 'Error should be null');
              assert.equal(res.status, 200, 'Status code should be 200');
              assert.isObject(res.body, 'Response body should be an Object');
              
              done();
            });
        });
        it('UPDATE existing Blog, require admin Authorization',(done) => { 
            chai.request(app)
             .put('/blogs/blog/'+blogId)
             .set('Authorization', `Bearer ${token}`)
             .attach('image', fs.readFileSync(path.join(__dirname, 'med1.jpg')), 'med1.jpg')
             .field('content', 'updated')
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               done();
            });
        });
        it('User login',(done) => {
            
            chai.request(app)
             .post('/auth/login')
             .send({ username: 'ng', password: 'nn' })
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               userToken=res.body.token;
               done();
             });
        });
        it('POST a Comment, require user Authorization',(done) => {
            
            chai.request(app)
             .post('/comments/'+blogId)
             .set('Authorization', `Bearer ${userToken}`)
             .send({ comment: 'This is cool'})
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               commentId=res.body._id;
               done();
            });
        });
        it('DELETE a comment, require user Authorization',(done) => { 
            chai.request(app)
             .delete('/comments/'+commentId)
             .set('Authorization', `Bearer ${userToken}`)
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               done();
            });
        });
        it('DELETE a new Blog, require admin Authorization',(done) => { 
            chai.request(app)
             .delete('/blogs/'+blogId)
             .set('Authorization', `Bearer ${token}`)
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               done();
            });
        });
    });

})  
