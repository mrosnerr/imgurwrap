/*global describe, before, beforeEach, after, afterEach, it */
'use strict';

var imgurwrap = require('../src/imgurwrap.js'),
    should = require('should');

// Default ClientID for imgurwrap. Only for use to test this module.
// Register your application and generate a Client_ID 
// at https://api.imgur.com/#register     
var clientID = 'eb5332f71090d90';

var imageIds = ['lEVc0PF', 'G80OxqS'],
    albumIds = ['PzWUu'],
    userIds = ['msrxthr'];

describe('imgurwrap', function() {
    describe('when a ClientID is not set', function() {
        it('should should generate an error', function(done) {
            imgurwrap.getImageData(imageIds[0], function(err, res) {
                should.exist(err);
                should.exist(err.message);
                should.not.exist(res);
                return done();
            });
        });
    });
    describe('when a ClientID is set', function() {
        beforeEach(function(done) {
            imgurwrap.setClientID(clientID);
            return done();
        });
        afterEach(function(done) {
            imgurwrap.setClientID(null);
            return done();
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
            var albumUrl = 'http://imgur.com/a/' + albumIds[0];
            var imageUrl = 'http://imgur.com/' + imageIds[0];
            var imagesUrl = 'http://imgur.com/' + imageIds.join(',') + '#1';
            var userUrl = 'http://' + userIds[0] + '.imgur.com';
            var someOtherUrl = 'http://idontknowsomethingelse.com/a/' + albumIds[0];
            (imgurwrap.isAlbum(albumUrl)).should.be.true;
            (imgurwrap.isAlbum(imageUrl)).should.not.be.true;
            (imgurwrap.isAlbum(imagesUrl)).should.not.be.true;
            (imgurwrap.isAlbum(userUrl)).should.not.be.true;
            (imgurwrap.isAlbum(someOtherUrl)).should.not.be.true;
            return done();
        });
        it('should be able to load an image by id', function(done) {
            imgurwrap.getImageData(imageIds[0], function(err, res) {
                if(err) return done(err);
                (res.model).should.equal('image');
                (res.success).should.be.true;
                (res.status).should.equal(200);
                (res.data.id).should.be.equal(imageIds[0]);
                return done();
            });
        });
        it('should be able to load an album by id', function(done) {
            imgurwrap.getAlbumData(albumIds[0], function(err, res) {
                if(err) return done(err);
                (res.model).should.equal('album');
                (res.success).should.be.true;
                (res.status).should.equal(200);
                (res.data.id).should.be.equal(albumIds[0]);
                (res.data.images.length).should.be.above(0);
                should.exist(res.data.cover);
                return done();
            });
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
        describe('given a URL', function() {
            describe('for an image', function(done) {
                it('should work for url\'s of the form "http://imgur.com/{id}"', function(done) {
                    var url = 'http://imgur.com/' + imageIds[0];
                    imgurwrap.getURLData(url, function(err, res) {
                        if(err) return done(err);
                        (res.model).should.equal('image');
                        (res.success).should.be.true;
                        (res.status).should.equal(200);
                        (res.data.id).should.be.equal(imageIds[0]);
                        (res.data.width).should.be.above(0);
                        (res.data.height).should.be.above(0);
                        should.exist(res.data.link);
                        return done();
                    });
                });
                it('should work for url\'s of the form "http://i.imgur.com/{id}.{ext}"', function(done) {
                    var url = 'http://i.imgur.com/' + imageIds[0] + '.jpg';
                    imgurwrap.getURLData(url, function(err, res) {
                        if(err) return done(err);
                        (res.model).should.equal('image');
                        (res.success).should.be.true;
                        (res.status).should.equal(200);
                        (res.data.id).should.be.equal(imageIds[0]);
                        (res.data.width).should.be.above(0);
                        (res.data.height).should.be.above(0);
                        should.exist(res.data.link);
                        return done();
                    });
                });
                it('should work for url\'s of the form "http://i.imgur.com/{id}.{ext}"', function(done) {
                    var url = 'http://i.imgur.com/' + imageIds[0] + '.jpg';
                    imgurwrap.getURLData(url, function(err, res) {
                        if(err) return done(err);
                        (res.model).should.equal('image');
                        (res.success).should.be.true;
                        (res.status).should.equal(200);
                        (res.data.id).should.be.equal(imageIds[0]);
                        (res.data.width).should.be.above(0);
                        (res.data.height).should.be.above(0);
                        should.exist(res.data.link);
                        return done();
                    });
                });
            });
            describe('for multiple images', function() {
                it('should work for url\'s of the form "http://imgur.com/{id.1},{id.2}"', function(done) {
                    var url = 'http://imgur.com/' + imageIds.join(',');
                    imgurwrap.getURLData(url, function(err, res) {
                        if(err) return done(err);
                        (res.model).should.equal('images');
                        (res.images.length).should.equal(imageIds.length);
                        res.images.forEach(function(image) {
                            (image.model).should.equal('image');
                            (image.success).should.be.true;
                            (image.status).should.equal(200);
                            (imageIds).should.containEql(image.data.id);
                            (image.data.width).should.be.above(0);
                            (image.data.height).should.be.above(0);
                            should.exist(image.data.link);
                        });
                        return done();
                    });
                });
                it('should work for url\'s of the form "http://imgur.com/{id.1},{id.2}#{i}"', function(done) {
                    var url = 'http://imgur.com/' + imageIds.join(',') + '#1';
                    imgurwrap.getURLData(url, function(err, res) {
                        if(err) return done(err);
                        (res.model).should.equal('images');
                        (res.images.length).should.equal(imageIds.length);
                        res.images.forEach(function(image) {
                            (image.model).should.equal('image');
                            (image.success).should.be.true;
                            (image.status).should.equal(200);
                            (imageIds).should.containEql(image.data.id);
                            (image.data.width).should.be.above(0);
                            (image.data.height).should.be.above(0);
                            should.exist(image.data.link);
                        });
                        return done();
                    });
                });
            });
            describe('for an album', function() {
                it('should work for url\'s of the form "http://i.imgur.com/{id}.{ext}"', function(done) {
                    var url = 'http://imgur.com/a/' + albumIds[0];
                    imgurwrap.getURLData(url, function(err, res) {
                        if(err) return done(err);
                        (res.model).should.equal('album');
                        (res.success).should.be.true;
                        (res.status).should.equal(200);
                        (res.data.id).should.be.equal(albumIds[0]);
                        (res.data.images.length).should.be.above(0);
                        should.exist(res.data.link);
                        return done();
                    });
                });
            });
        });
    });
});