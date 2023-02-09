import chai from "chai"
import chaiHttp from "chai-http"
import app from "../src/test"
// import mongoose from "mongoose";

chai.use(chaiHttp);
const { expect, assert } = chai;
let token;
let userId;

// before(async () => {
//     mongoose.set('strictQuery', true);
//     try {
//       await mongoose.connect(process.env.MONGO_URL_TESTS);
//       console.log("Using Tests Database");
//     } catch (error) {
//       console.error(error);
//     }
// });


describe("All Users API EndPoints",()=>{
    
    describe('User login', () => {
        it('should return the expected response',(done) => {
           chai.request(app)
            .post('/auth/login')
            .send({ username: 'dev', password: 'dev' })
            .end((err, res) => {
              assert.isNull(err, 'Error should be null');
              assert.equal(res.status, 200, 'Status code should be 200');
              assert.isObject(res.body, 'Response body should be an Array');
              token=res.body.token;
              userId=res.body._id;
              done();
            });
        });
    });
    describe('API which require Authorization', () => {
        let adminToken;
        it('Admin login',(done) => {
            
           chai.request(app)
            .post('/auth/admin/login')
            .send({ username: 'ngoma', password: 'ngoma' })
            .end((err, res) => {
              assert.isNull(err, 'Error should be null');
              assert.equal(res.status, 200, 'Status code should be 200');
              assert.isObject(res.body, 'Response body should be an Object');
              adminToken=res.body.token;
              done();
            });
        });
        
        it('Should return a all Users',(done) => {
           chai.request(app)
            .get('/auth')
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
              assert.isNull(err, 'Error should be null');
              assert.equal(res.status, 200, 'Status code should be 200');
              assert.isArray(res.body, 'Response body should be an Object');
              done();
            });
        });
        it('UPDATE existing User, require user Authorization',(done) => { 
            chai.request(app)
             .put('/auth/profile/'+userId)
             .set('Authorization', `Bearer ${token}`)
             .send({ password: 'tik' })
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               done();
            });
        });
        it('DELETE a User, require admin/user Authorization',(done) => { 
            chai.request(app)
             .delete('/auth/account/'+userId)
             .set('Authorization', `Bearer ${adminToken}`)
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 200, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               done();
            });
        });
    });
})  
