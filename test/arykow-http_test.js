'use strict';

var arykow = {
  http: require('../lib/arykow-http.js'),
  test: require('../test/arykow-test.js').Test
};

var UTIL = require('util');

arykow.test.prototype.testGetURLSuccess = function(uri) {
  return this.testPromise(true, arykow.http.get().uri(uri).execute(), "testGetURLSuccess: " + UTIL.inspect(arguments));
};

arykow.test.prototype.testGetURLFailure = function(uri) {
  return this.testPromise(false, arykow.http.get().uri(uri).execute(), "testGetURLFailure: " + UTIL.inspect(arguments));
};

exports['get'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'success tests': new arykow.test()
    .testGetURLSuccess('http://www.google.fr')
    .testGetURLSuccess('http://www.google.com')
    .testGetURLSuccess('http://www.google.com/not.exists')
    .run(),
  'failure tests': new arykow.test()
    .testGetURLFailure('http://127.0.0.1:3093/not.exists')
    .testGetURLFailure('ht:tp://www.google.fr')
    .run()
};