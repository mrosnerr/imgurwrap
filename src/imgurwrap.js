'use strict';
var imgurwrap = module.exports;
var request = require('request');

/**                                                                                                                                                                
 * Error handling
 */
var _errorMessages = {
    400: 'A required parameter is missing or a parameter has a value that is out of bounds or otherwise incorrect. This status code is also returned when image uploads fail due to images that are corrupt or do not meet the format requirements.',
    401: 'The request requires user authentication. Either you didn\'t send send OAuth credentials, or the ones you sent were invalid.',
    403: 'Forbidden. You don\'t have access to this action. If you\'re getting this error, check that you haven\'t run out of API credits or make sure you\'re sending the OAuth headers correctly and have valid tokens/secrets.',
    404: 'Resource does not exist. This indicates you have requested a resource that does not exist. For example, requesting an image that doesn\'t exist.',
    429: 'Rate limiting. This indicates you have hit either the rate limiting on the application or on the user\'s IP address.',
    500: 'Unexpected internal error. What it says. We\'ll strive NOT to return these but your app should be prepared to see it. It basically means that something is broken with the Imgur service.',
    503: 'The server is currently unavailable (because it is overloaded or down for maintenance). Generally, this is a temporary state.'
};

var _ImgurError = function(status, msg) {
    Error.call(this);
    Error.captureStackTrace(this, _ImgurError);
    this.status = status;
    this.message = msg || _errorMessages[status] || 'An error occured while loading a resource from Imgur';
    this.name = 'ImgurError ' + (status ? status : '0');
};

_ImgurError.prototype = Object.create(Error.prototype);

/**                                                                                                                                                                                                                   
 * URL parsing and testing
 */
var _imgurDomain = /.*\/\/((i|m)\.)?imgur.com\/.*$/;
var _imgurAlbumTest = /.*\/a\/.*/;
var _imgurIdParse = /^.*\/([a-zA-Z0-9,]+)[\?#\.]?.*$/;

imgurwrap.isAlbum = function(url) {
    return _imgurDomain.test(url) && _imgurAlbumTest.test(url);
};


var _headers = {
    'User-Agent': 'imgurwrap default useragent v1.1'
};

imgurwrap.setClientID = function(clientID) {
    if(clientID) {
        _headers.Authorization = 'Client-ID ' + clientID);
    } else {
        _headers.Authorization = clientID;
    }
};

imgurwrap.setUserAgent = function(useragent) {
    _headers['User-Agent'] = useragent;
};

var _host = 'https://api.imgur.com';
imgurwrap.setApiHost = function(host) {
    _host = host;
};

var _api = 3;
imgurwrap.setApiVersion = function(api) {
    _api = api;
};

imgurwrap.setMashapeAuthID = function(mashapeAuthID) {
    if (mashapeAuthID) {
        _headers['X-Mashape-Authorization'] = mashapeAuthID;
        _host = 'https://imgur-apiv3.p.mashape.com/';
    }
};

var _getEndpoint = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(_api);
    args.unshift(_host);
    return args.join('/');
};

var _getBaseRequestParams = function(endpoint) {
    return {
        url: endpoint,
        headers: _headers,
        json: true
    };
};

var _validateRequestParams = function(params) {
    if(!params.headers.Authorization) {
        return new _ImgurError(null, 'ClientID is not set. Please set by calling setClientID(...)');
    }
};

var _responseCallback = function(callback) {
    return function(err, response, result) {
        if(err) {
            return callback(err);
        } else if(response.statusCode !== 200) {
            return callback(new _ImgurError(response.statusCode));
        } else {
            if(result) {
                result.model = response.req.path.split('/')[2];
                return callback(null, result);
            } else {
                return callback(new _ImgurError(null, 'No data recieved in the response.'));
            }
        }
    };
};

/**
 * API
 */
imgurwrap.getRateLimitingData = function(callback) {
    var endpoint = _getEndpoint('credits');
    var params = _getBaseRequestParams(endpoint);
    var err = _validateRequestParams(params);
    if (err) {
        return callback(err);
    }
    return request.get(params, _responseCallback(callback));
};

imgurwrap.getImageData = function(id, callback) {
    var endpoint = _getEndpoint('image', id);
    var params = _getBaseRequestParams(endpoint);
    var err = _validateRequestParams(params);
    if (err) {
        return callback(err);
    }
    return request.get(params, _responseCallback(callback));
};

imgurwrap.getAlbumData = function(id, callback) {
    var endpoint = _getEndpoint('album', id);
    var params = _getBaseRequestParams(endpoint);
    var err = _validateRequestParams(params);
    if (err) {
        return callback(err);
    }
    return request.get(params, _responseCallback(callback));
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
    if(!_imgurDomain.test(url)) {
        return callback(new _ImgurError(null, 'not an imgur url "' + url + '"'));
    }
    var match = _imgurIdParse.exec(url);
    if(!match || !match[1]) {
        return callback(new _ImgurError(null, 'unable to extract imgur id from "' + url + '"'));
    }
    var idArr = match[1].split(',');
    if(idArr.length === 1) {
        if(imgurwrap.isAlbum(url)) {
            return imgurwrap.getAlbumData(idArr[0], callback);
        } else {
            return imgurwrap.getImageData(idArr[0], callback);
        }
    } else {
        var remaining = idArr.length;
        var images = [];
        var success = true;
        idArr.forEach(function(myId) {
            imgurwrap.getImageData(myId, function(err, result) {
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
    }
};
