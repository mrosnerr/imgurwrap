'use strict';
var request = require('request');
var imgurwrapUtil = require('./imgurwrap.util.js');
var imgurwrapImage = require('./imgurwrap.image.js');
var imgurwrapAlbum = require('./imgurwrap.album.js');
var imgurwrap = module.exports;

/**
 * URL parsing and testing
 */
var _imgurDomain = /.*\/\/((i|m)\.)?imgur.com\/.*$/;
var _imgurAlbumTest = /.*\/a\/.*/;

imgurwrap.isImgurURL = function(url) {
    return _imgurDomain.test(url);
};

imgurwrap.isAlbumURL = function(url) {
    return _imgurDomain.test(url) && _imgurAlbumTest.test(url);
};

imgurwrap.getRateLimitingData = function(callback) {
    var endpoint = imgurwrapUtil.getEndpoint('credits');
    var params = imgurwrapUtil.getBaseRequestParams(endpoint);
    var err = imgurwrapUtil.validateRequestParams(params);
    if (err) {
        return callback(err);
    }
    return request.get(params, imgurwrapUtil.responseCallback(callback));
};

var _loadMultipleImages = function(idArr, callback) {
    var remaining = idArr.length;
    var images = [];
    idArr.forEach(function(myId) {
        imgurwrapImage.getImageData(myId, function(err, result) {
            if(err) {
                return callback(err);
            } else {
                images.push(result);
                if(--remaining === 0) {
                    return callback(null, {
                        images: images,
                        model: 'images'
                    });
                }
            }
        });
    });
};

/**                                                                                                                                                                                                                   
 * Given an Imgur URL for an image, images, or an album, it will determine the correct endpoint
 * to use and return the appropriate data. URL's of the following forms are handled:
 *
 * http://imgur.com/G80OxqS
 * http://i.imgur.com/G80OxqS.jpg
 * http://imgur.com/G80OxqS,PzWUu,PzWUu
 * http://imgur.com/a/PzWUu
 */
imgurwrap.getURLData = function(url, callback) {
    if(!imgurwrapUtil.isImgurURL(url)) {
        return callback(new imgurwrapUtil.ImgurError(null, 'not an imgur url "' + url + '"'));
    }
    var idArr = imgurwrapUtil.parseImageIds(url);
    if(!idArr || idArr.length < 1) {
        return callback(new imgurwrapUtil.ImgurError(null, 'unable to extract imgur id from "' + url + '"'));
    }
    if(idArr.length === 1) {
        if(imgurwrapUtil.isAlbumURL(url)) {
            return imgurwrapAlbum.getAlbumData(idArr[0], callback);
        }
        return imgurwrapImage.getImageData(idArr[0], callback);
    }
    return _loadMultipleImages(idArr, callback);
};
