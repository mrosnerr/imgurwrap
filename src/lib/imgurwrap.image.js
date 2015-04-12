'use strict';
var request = require('request');
var imgurwrapUtil = require('./imgurwrap.util.js');
var imgurwrap = module.exports;

imgurwrap.getImageData = function(id, callback) {
    var endpoint = imgurwrapUtil.getEndpoint('image', id);
    var params = imgurwrapUtil.getBaseRequestParams(endpoint);
    var err = imgurwrapUtil.validateRequestParams(params);
    if (err) {
        return callback(err);
    }
    return request.get(params, imgurwrapUtil.responseCallback(callback));
};
