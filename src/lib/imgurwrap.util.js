'use strict';
var request = require('request');
var util = require('util');
var imgurwrap = module.exports;

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

imgurwrap.ImgurError = function(status, msg) {
    Error.call(this);
    Error.captureStackTrace(this, imgurwrap.ImgurError);
    this.status = status;
    this.message = msg || _errorMessages[status] || 'An error occured while loading a resource from Imgur';
    this.name = 'ImgurError ' + (status ? status : '0');
};

imgurwrap.ImgurError.prototype = Object.create(Error.prototype);

var _imgurIdParse = /^.*\/([a-zA-Z0-9,]+)[\?#\.]?.*$/;

imgurwrap.parseImageIds = function(url) {
  var match = _imgurIdParse.exec(url);
    if(!match || !match[1]) {
        return [];
    }
    return match[1].split(',');  
};

var _headers = {
    'User-Agent': 'imgurwrap default useragent v1.1'
};

imgurwrap.setClientID = function(clientID) {
    if(clientID) {
        _headers.Authorization = util.format('Client-ID %s', clientID);
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

imgurwrap.getEndpoint = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(_api);
    args.unshift(_host);
    return args.join('/');
};

imgurwrap.getBaseRequestParams = function(endpoint) {
    return {
        url: endpoint,
        headers: _headers,
        json: true
    };
};

imgurwrap.validateRequestParams = function(params) {
    if(!params.headers.Authorization) {
        return new imgurwrap.ImgurError(null, 'ClientID is not set. Please set by calling setClientID(...)');
    }
};

imgurwrap.responseCallback = function(callback) {
    return function(err, response, result) {
        if(err) {
            return callback(err);
        } else if(response.statusCode !== 200) {
            var error = new imgurwrap.ImgurError(response.statusCode);
            if (result && result.data && result.data.error) {
                error.message = result.data.error;
            }
            return callback(error);
        } else {
            if(result) {
                result.model = response.req.path.split('/')[2];
                return callback(null, result);
            } else {
                return callback(new imgurwrap.ImgurError(null, 'No data recieved in the response.'));
            }
        }
    };
};
