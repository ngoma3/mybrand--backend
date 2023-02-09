import chai from "chai"
import chaiHttp from "chai-http"
import app from "../src/test"
// import mongoose from "mongoose";

chai.use(chaiHttp);
const { expect, assert } = chai;

let msgId;
let adminToken;


// before(async () => {
//     mongoose.set('strictQuery', true);
//     try {
//       await mongoose.connect(process.env.MONGO_URL_TESTS);
//       console.log("Using Tests Database");
//     } catch (error) {
//       console.error(error);
//     }
// });


describe("All Messages API EndPoints",()=>{
    describe('POST a message', () => {
        it('should return the expected response',(done) => {
           chai.request(app)
            .post('/messages')
            .send({ name: 'ngggggggggggggggggg', email: 'nnnnnnnnnnnn', content: 'nnnnnnnnnnnnn' })
            .end((err, res) => {
              assert.isNull(err, 'Error should be null');
              assert.equal(res.status, 200, 'Status code should be 200');
              assert.isObject(res.body, 'Response body should be an Array');
              msgId=res.body._id;
              done();
            });
        });
    });
    describe('API which require admin Authorization', () => {
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
        
        it('Should return a all Messages',(done) => {
           chai.request(app)
            .get('/messages')
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
              assert.isNull(err, 'Error should be null');
              assert.equal(res.status, 200, 'Status code should be 200');
              assert.isArray(res.body, 'Response body should be an Object');
              done();
            });
        });
        it('DELETE a message, require admin Authorization',(done) => { 
            chai.request(app)
             .delete('/messages/'+msgId)
             .set('Authorization', `Bearer ${adminToken}`)
             .end((err, res) => {
               assert.isNull(err, 'Error should be null');
               assert.equal(res.status, 204, 'Status code should be 200');
               assert.isObject(res.body, 'Response body should be an Object');
               done();
            });
        });
    });
})  
