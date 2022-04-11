const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const {
  expect
} = chai;
chai.use(chaiHttp);

// Test Suite
describe('Testing Server Health ', () => {
  // Test Case
  it('/GET Server Health', (done) => {
    chai.request(server).get('/api/health').end((err, res) => {
      if (err) {
        console.log('err', err);
        done();
      }
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
});
