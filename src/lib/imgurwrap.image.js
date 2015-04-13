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

imgurwrap.uploadImageURL = function(payload, callback) {
    var endpoint = imgurwrapUtil.getEndpoint('image');
    var params = imgurwrapUtil.getBaseRequestParams(endpoint);
    payload.type = 'URL';
    params.formData = payload;
    var err = imgurwrapUtil.validateRequestParams(params);
    if (err) {
        return callback(err);
    }
    return request.post(params, imgurwrapUtil.responseCallback(callback));
};

imgurwrap.uploadImageFile = function(payload, callback) {
    var endpoint = imgurwrapUtil.getEndpoint('image');
    var params = imgurwrapUtil.getBaseRequestParams(endpoint);
    payload.type = 'file';
    params.formData = payload;
    var err = imgurwrapUtil.validateRequestParams(params);
    if (err) {
        return callback(err);
    }
    return request.post(params, imgurwrapUtil.responseCallback(callback));
};

imgurwrap.uploadImageBase64 = function(payload, callback) {
    var endpoint = imgurwrapUtil.getEndpoint('image');
    var params = imgurwrapUtil.getBaseRequestParams(endpoint);
    payload.type = 'base64';
    params.formData = payload;
    var err = imgurwrapUtil.validateRequestParams(params);
    if (err) {
        return callback(err);
    }
    return request.post(params, imgurwrapUtil.responseCallback(callback));
};

imgurwrap.deleteImage = function(id, callback) {
    var endpoint = imgurwrapUtil.getEndpoint('image', id);
    var params = imgurwrapUtil.getBaseRequestParams(endpoint);
    var err = imgurwrapUtil.validateRequestParams(params);
    if (err) {
        return callback(err);
    }
    return request.del(params, imgurwrapUtil.responseCallback(callback));
};
