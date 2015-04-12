/*global describe, before, beforeEach, after, afterEach, it */
'use strict';
var imgurwrap = require('../src/imgurwrap.js');
var request = require('request');
var should = require('should');

var clientID = 'eb5332f71090d90';
imgurwrap.setClientID(clientID);

var imageId = 'a9uzvgf';
var albumId = 'PzWUu';

describe('imgurwrap', function() {
    it('should fail when no ClientId is set', function(done) {
        imgurwrap.setClientID(null);
        imgurwrap.getImageData(imageId, function(err, res) {
            should.exist(err);
            should.exist(err.message);
            should.not.exist(res);
            imgurwrap.setClientID(clientID);
            return done();
        });
    });
    it('should be able to load rate limiting information', function(done) {
        imgurwrap.getRateLimitingData(function(err, res) {
            if(err) return done(err);
            (res.model).should.equal('credits');
            (res.success).should.be.true;
            (res.status).should.equal(200);
            (res.data.UserRemaining).should.be.above(-1);
            return done();
        });
    });
    it('should be able to test if a URL is for an album', function(done) {
        var albumUrl = 'http://imgur.com/a/' + albumId;
        var imageUrl = 'http://imgur.com/' + imageId;
        var imagesUrl = 'http://imgur.com/' + [albumId, albumId].join(',') + '#1';
        var userUrl = 'http://' + albumId + '.imgur.com';
        var someOtherDomain = 'http://idontknowsomethingelse.com/a/' + albumId;
        (imgurwrap.isAlbumURL(albumUrl)).should.be.true;
        (imgurwrap.isAlbumURL(imageUrl)).should.not.be.true;
        (imgurwrap.isAlbumURL(imagesUrl)).should.not.be.true;
        (imgurwrap.isAlbumURL(userUrl)).should.not.be.true;
        (imgurwrap.isAlbumURL(someOtherDomain)).should.not.be.true;
        return done();
    });
    it('should be able to handle 404 errors', function(done) {
        imgurwrap.getImageData('somemadeupidthatdoesnotexistandneverwillbecauseitswayytoolong', function(err, res) {
            should.not.exist(res);
            should.exist(err);
            should.exist(err.message);
            should.exist(err.stack);
            (err.status).should.equal(404);
            return done();
        });
    });
});