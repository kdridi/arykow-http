'use strict';

var Q = require('q');

var Test = function() {
  this.numAssertions = 0;
  this.functions = [];
};

Test.prototype.pushPromise = function(numAssertions, func) {
  this.numAssertions += numAssertions;
  this.functions.push(func);
  return this;
};

Test.prototype.pushTest = function(numAssertions, func) {
  this.numAssertions += numAssertions;
  this.functions.push(function(test) {
    func(test);
    return test;
  });
  return this;
};

Test.prototype.run = function() {
  var functions = this.functions;
  var numAssertions = this.numAssertions;
  return function (test) {
    var deferred = Q.defer();
    if(test) {
      test.expect(numAssertions + 1);
      deferred.resolve(test);
    } else {
      deferred.reject(new Error('test is null'));
    }
    var promise = deferred.promise;
    functions.forEach(function(f) {
      promise = promise.then(function(test) {
        return f(test);
      });
    });
    promise.then(function(result) {
      test.equal(result, test);
      test.done();
    }, function(error) {
      test.equal(error, null);
      test.done();
    });
  };
};

Test.prototype.testPromise = function(ok, promise, message) {
  return this.pushPromise(ok ? 2 : 2, function(test) {
    return promise
      .then(function(result) {
        test.equal(ok, true, "assert ok is true with " + message);
        test.notEqual(result, null, "assert result is not null with " + message);
        return test;
      }, function(error) {
        test.equal(ok, false, "assert ok is false with " + message);
        test.notEqual(error, null, "assert error is not null with " + message);
        return test;
      });
  });
};

exports.Test = Test;