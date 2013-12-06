/*
 * arykow-http
 * https://github.com/kdridi/arykow-http
 *
 * Copyright (c) 2013 Karim DRIDI
 * Licensed under the MIT license.
 */

'use strict';

var Q = require('q'),
	REQUEST = require('request').defaults({
        jar: false,
        method: 'GET',
        headers: {},
        followRedirect: true,
        followAllRedirects: true,
        maxRedirects: 10,
        encoding: null
    });

var Request = function(method) {
	this.options = {
		jar: false,
		method: method,
		headers: {},
		followRedirect: true,
		followAllRedirects: true,
		maxRedirects: 10,
		encoding: null
	};
};

Request.prototype.uri = function(uri) {
	this.options.uri = uri;
	return this;
};

Request.prototype.execute = function() {
	var deferred = Q.defer();
	REQUEST(this.options, function(error, response, body) {
		if(error) {
			deferred.reject(error);
		} else {
			deferred.resolve({ response: response,
				body: body });
		}
	});
	return deferred.promise;
};

exports.get = function () {
	return new Request('GET');
};

exports.post = function () {
	return new Request('POST');
};