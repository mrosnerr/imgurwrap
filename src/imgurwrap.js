'use strict';
var _ = require('lodash');
var request = require('request');

module.exports = _.extend(
    require('./lib/imgurwrap.util.js'),
    require('./lib/imgurwrap.common.js'),
	require('./lib/imgurwrap.image.js'),
    require('./lib/imgurwrap.album.js')
);
