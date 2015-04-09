/**
 * This file is part of Node Package Comparator.
 *
 * Node Package Comparator is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * Node Package Comparator is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *   along with Node Package Comparator.  If not, see <http://www.gnu.org/licenses/>.
 */
'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Scheduler = require('./scheduler.model');

describe('GET /api/schedulers', function() {

  var totalTestSchedulerPackagesCount = 100;
  before(function (next) {
    var schedulers = [], _i;
    for (_i = 1; _i <= totalTestSchedulerPackagesCount; _i++) {
      schedulers.push({
        type: 'package',
        keyword: 'keyword' + _i,
        amount: _i
      });
    }
    Scheduler.remove({}).exec(function (err) {
      if (err) {
        console.log('Error on remove');
        return next(err);
      }
      Scheduler.create(schedulers, function (err, schedulers) {
        console.log('Error on create?', err, schedulers.length);
        next(err);
      })
    });
  });



  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/schedulers/keywords')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        should(res.body.length).be.equal(totalTestSchedulerPackagesCount);
        done();
      });
  });


  it('should respond with JSON and limted by 10', function (done) {
    request(app)
      .get('/api/schedulers/keywords?limit=10')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        should(res.body.length).be.exactly(10);
        done();
      });
  });

  it('should respond with JSON and limted by 10, skip the first 10', function (done) {
    request(app)
      .get('/api/schedulers/keywords?limit=10&skip=10')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        should(res.body.length).be.exactly(10);
        should(res.body[0].keyword).be.equal('keyword18');
        done();
      });
  });

  it('should respond with JSON and count', function (done) {
    request(app)
      .get('/api/schedulers/keywords?limit=10&skip=10&count=true')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        should(res.body.count).be.equal(100);
        done();
      });
  });
});
