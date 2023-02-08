<<<<<<< HEAD
import chai from "chai"
import chaiHttp from "chai-http"
import fs from "fs"
import path from "path"
import app from "../src/test"

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
  
    describe('API which require admin Authorization', () => {
        let token;
        let userToken;
        let blogId;
        let commentId;
        let blogId2;
        let commentId2;
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
        it('POST a new Blog, Negative Test',(done) => {
            
            chai.request(app)
             .post('/blog')
             .set('Authorization', `Bearer ${token}`)
             .attach('image', fs.readFileSync(path.join(__dirname, 'med1.jpg')), 'med1.jpg')
             .end((err, res) => {
               assert.equal(res.status, 404, 'Status code should be 200');
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
               expect(res.body).to.have.property('article').equal('Test');
               expect(res.body).to.have.property('category').equal('Test');
               expect(res.body).to.have.property('content').equal('Test');
               blogId=res.body._id;
               done();
            });
        });
        it('POST a Blog, require admin Authorization',(done) => {
            
            chai.request(app)
             .post('/blogs')
             .set('Authorization', `Bearer ${token}`)
             .attach('image', fs.readFileSync(path.join(__dirname, 'med1.jpg')), 'med1.jpg')
             .field('article', 'Test')
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               expect(res.body).to.have.property('article').equal('Test');
               blogId2 =res.body._id;
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
              expect(res.body).to.have.property('article');
              expect(res.body).to.have.property('category');
              expect(res.body).to.have.property('content');
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
               expect(res.body).to.have.property('message').equal('Updated successfuly');
               done();
            });
        });
        it('User signup',(done) => {
          chai.request(app)
           .post('/auth/signup')
           .send({ username: 'dev',email: "tik@tok.c", password: 'dev' })
           .end((err, res) => {
             assert.isNull(err, 'Error should be null');
             assert.equal(res.status, 200, 'Status code should be 200');
             assert.isObject(res.body, 'Response body should be an Array');
             expect(res.body).to.have.property('token');
             done();
           });
       });
        it('User login',(done) => {
            
            chai.request(app)
             .post('/auth/login')
             .send({ username: 'dev', password: 'dev' })
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               expect(res.body).to.have.property('token');
               userToken=res.body.token;
               done();
             });
        });
        it('POST a Comment, Negative Test',(done) => {
            
            chai.request(app)
             .post('/comment/'+blogId)
             .set('Authorization', `Bearer ${userToken}`)
             .send({ comment: 'This is cool'})
             .end((err, res) => {
               assert.equal(res.status, 404, 'Status code should be 200');
               done();
            });
        });
        it('POST a Comment, require user Authorization', (done) => { 
            chai.request(app)
             .post('/comments/'+blogId)
             .set('Authorization', `Bearer ${userToken}`)
             .send({ comment: 'This is cool'})
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               expect(res.body).to.have.property('_id');
               expect(res.body).to.have.property('comment');
               commentId = res.body._id;
               done();
            });
        });
        it('POST a Comment, require user Authorization',(done) => {   
            chai.request(app)
             .post('/comments/'+blogId)
             .set('Authorization', `Bearer ${userToken}`)
             .send({ comment: 'This is great'})
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               commentId2 =res.body._id;
               done();
            });
        });
        it('DELETE a comment, Negative Test',(done) => { 
            chai.request(app)
             .delete('/comment/'+ commentId)
             .set('Authorization', `Bearer ${userToken}`)
             .end((err, res) => {
               assert.equal(res.status, 404, 'Status code should be 200');
               done();
            });
        });
        it('DELETE a comment, require user Authorization',(done) => { 
            chai.request(app)
             .delete('/comments/'+ commentId)
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
        it('DELETE a new Blog, require admin Authorization',(done) => { 
            chai.request(app)
             .delete('/blogs/'+blogId2)
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
=======
import chai from "chai"
import chaiHttp from "chai-http"
import fs from "fs"
import path from "path"
import app from "../src/test"

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
  
    describe('API which require admin Authorization', () => {
        let token;
        let userToken;
        let blogId;
        let commentId;
        let blogId2;
        let commentId2;
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
        it('POST a new Blog, Negative Test',(done) => {
            
            chai.request(app)
             .post('/blog')
             .set('Authorization', `Bearer ${token}`)
             .attach('image', fs.readFileSync(path.join(__dirname, 'med1.jpg')), 'med1.jpg')
             .end((err, res) => {
               assert.equal(res.status, 404, 'Status code should be 200');
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
               expect(res.body).to.have.property('article').equal('Test');
               expect(res.body).to.have.property('category').equal('Test');
               expect(res.body).to.have.property('content').equal('Test');
               blogId=res.body._id;
               done();
            });
        });
        it('POST a Blog, require admin Authorization',(done) => {
            
            chai.request(app)
             .post('/blogs')
             .set('Authorization', `Bearer ${token}`)
             .attach('image', fs.readFileSync(path.join(__dirname, 'med1.jpg')), 'med1.jpg')
             .field('article', 'Test')
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               expect(res.body).to.have.property('article').equal('Test');
               blogId2 =res.body._id;
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
              expect(res.body).to.have.property('article');
              expect(res.body).to.have.property('category');
              expect(res.body).to.have.property('content');
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
               expect(res.body).to.have.property('message').equal('Updated successfuly');
               done();
            });
        });
        it('User signup',(done) => {
          chai.request(app)
           .post('/auth/signup')
           .send({ username: 'dev',email: "tik@tok.c", password: 'dev' })
           .end((err, res) => {
             assert.isNull(err, 'Error should be null');
             assert.equal(res.status, 200, 'Status code should be 200');
             assert.isObject(res.body, 'Response body should be an Array');
             expect(res.body).to.have.property('token');
             done();
           });
       });
        it('User login',(done) => {
            
            chai.request(app)
             .post('/auth/login')
             .send({ username: 'dev', password: 'dev' })
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               expect(res.body).to.have.property('token');
               userToken=res.body.token;
               done();
             });
        });
        it('POST a Comment, Negative Test',(done) => {
            
            chai.request(app)
             .post('/comment/'+blogId)
             .set('Authorization', `Bearer ${userToken}`)
             .send({ comment: 'This is cool'})
             .end((err, res) => {
               assert.equal(res.status, 404, 'Status code should be 200');
               done();
            });
        });
        it('POST a Comment, require user Authorization', (done) => { 
            chai.request(app)
             .post('/comments/'+blogId)
             .set('Authorization', `Bearer ${userToken}`)
             .send({ comment: 'This is cool'})
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               expect(res.body).to.have.property('_id');
               expect(res.body).to.have.property('comment');
               commentId = res.body._id;
               done();
            });
        });
        it('POST a Comment, require user Authorization',(done) => {   
            chai.request(app)
             .post('/comments/'+blogId)
             .set('Authorization', `Bearer ${userToken}`)
             .send({ comment: 'This is great'})
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               commentId2 =res.body._id;
               done();
            });
        });
        it('DELETE a comment, Negative Test',(done) => { 
            chai.request(app)
             .delete('/comment/'+ commentId)
             .set('Authorization', `Bearer ${userToken}`)
             .end((err, res) => {
               assert.equal(res.status, 404, 'Status code should be 200');
               done();
            });
        });
        it('DELETE a comment, require user Authorization',(done) => { 
            chai.request(app)
             .delete('/comments/'+ commentId)
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
        it('DELETE a new Blog, require admin Authorization',(done) => { 
            chai.request(app)
             .delete('/blogs/'+blogId2)
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
>>>>>>> 348b5b0 (maintainability)
