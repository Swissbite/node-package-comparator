'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/settings', function() {

  it('should respond with 401', function (done) {
    request(app)
      .get('/api/settings')
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});