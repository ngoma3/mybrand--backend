import chai from "chai"
import chaiHttp from "chai-http"

// const chai = require("chai")
// const chaiHttp = require("chai-http")
// const app = require("../src/app")
import app from "../src/app"

chai.use(chaiHttp);
const { expect, assert } = chai;

describe("Blogs API",()=>{
    describe('GET  all blogs', () => {
        it('should return the expected response', async (done) => {
           chai.request(app)
            .get('/blogs')
            .end((err, res) => {
              assert.isNull(err, 'Error should be null');
              assert.equal(res.status, 200, 'Status code should be 200');
              assert.isObject(res.body, 'Response body should be an object');
              
              done();
            });
        });
      });
})
