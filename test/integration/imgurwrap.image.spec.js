/*global describe, before, beforeEach, after, afterEach, it */
'use strict';
var imgurwrap = require('../../src/imgurwrap.js');
var fs = require('fs');
var chai = require('chai');

var should = chai.should();

imgurwrap.setClientID('eb5332f71090d90');

var imageId = 'nVQtKSl';
var imageId2 = 'G80OxqS';

describe('imgurwrap', function() {
    this.timeout(10000);
    describe('for getting an image', function() {
        it('should be able to load by id', function(done) {
            imgurwrap.getImageData(imageId, function(err, res) {
                if(err) return done(err);
                (res.model).should.equal('image');
                (res.success).should.be.true;
                (res.status).should.equal(200);
                (res.data.id).should.be.equal(imageId);
                return done();
            });
        });
        it('should be able to load by URL\'s of the form "http://imgur.com/{id}"', function(done) {
            var url = 'http://imgur.com/' + imageId;
            imgurwrap.getURLData(url, function(err, res) {
                if(err) return done(err);
                (res.model).should.equal('image');
                (res.success).should.be.true;
                (res.status).should.equal(200);
                (res.data.id).should.be.equal(imageId);
                (res.data.width).should.be.above(0);
                (res.data.height).should.be.above(0);
                should.exist(res.data.link);
                return done();
            });
        });
        it('should be able to load by URL\'s of the form "http://i.imgur.com/{id}.{ext}"', function(done) {
            var url = 'http://i.imgur.com/' + imageId + '.jpg';
            imgurwrap.getURLData(url, function(err, res) {
                if(err) return done(err);
                (res.model).should.equal('image');
                (res.success).should.be.true;
                (res.status).should.equal(200);
                (res.data.id).should.be.equal(imageId);
                (res.data.width).should.be.above(0);
                (res.data.height).should.be.above(0);
                should.exist(res.data.link);
                return done();
            });
        });
    });
    describe('for getting multiple images', function() {
        var imageIds = [imageId, imageId2];
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
                    (imageIds).should.include(image.data.id);
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
                    (imageIds).should.include(image.data.id);
                    (image.data.width).should.be.above(0);
                    (image.data.height).should.be.above(0);
                    should.exist(image.data.link);
                });
                return done();
            });
        });
    });
    describe('for uploading an image', function() {

        var imageURL = 'http://i.imgur.com/' + imageId + '.jpg';
        var imagePath = __dirname + '/../fixtures/test.jpg';
        var imageData = fs.readFileSync(imagePath);
        var deleteHash;
        var payload;
        beforeEach(function(done) {
            deleteHash = null;
            payload = {
                title: 'Title',
                description: 'Description'
            };
            done();
        });
        afterEach(function(done) {
            if (!deleteHash) {
                return done();
            }
            imgurwrap.deleteImage(deleteHash, function(err) {
                if(err) return done(err);
                return done();
            });
        });
        it('should work for a URL', function(done) {
            payload.image = imageURL;
            imgurwrap.uploadImageURL(payload, function(err, res) {
                if(err) return done(err);
                deleteHash = res.data.deletehash;
                var uploadId = res.data.id;
                imgurwrap.getImageData(uploadId, function(err, res) {
                    if(err) return done(err);
                    (res.data.id).should.be.equal(uploadId);
                    (res.data.title).should.be.equal(payload.title);
                    (res.data.description).should.be.equal(payload.description);
                    return done();
                });
            });
        });
        it('should work for a file', function(done) {
            payload.image = imageData;
            imgurwrap.uploadImageFile(payload, function(err, res) {
                if(err) return done(err);
                deleteHash = res.data.deletehash;
                var uploadId = res.data.id;
                imgurwrap.getImageData(uploadId, function(err, res) {
                    if(err) return done(err);
                    (res.data.id).should.be.equal(uploadId);
                    (res.data.title).should.be.equal(payload.title);
                    (res.data.description).should.be.equal(payload.description);
                    return done();
                });
            });
        });
        it('should work for a base64 encoded file', function(done) {
            payload.image = imageData.toString('base64');
            imgurwrap.uploadImageBase64(payload, function(err, res) {
                if(err) return done(err);
                deleteHash = res.data.deletehash;
                var uploadId = res.data.id;
                imgurwrap.getImageData(uploadId, function(err, res) {
                    if(err) return done(err);
                    (res.data.id).should.be.equal(uploadId);
                    (res.data.title).should.be.equal(payload.title);
                    (res.data.description).should.be.equal(payload.description);
                    return done();
                });
            });
        });
    });
    describe('for deleting an image', function() {
        var imageURL = 'http://i.imgur.com/' + imageId + '.jpg';
        var deleteHash;
        var uploadId;
        var payload;
        beforeEach(function(done) {
            deleteHash = null;
            payload = {
                title: 'Title',
                description: 'Description',
                image: imageURL
            };
            imgurwrap.uploadImageURL(payload, function(err, res) {
                if(err) return done(err);
                deleteHash = res.data.deletehash;
                uploadId = res.data.id;
                done();
            });
        });
        it('should work', function(done) {
            imgurwrap.deleteImage(deleteHash, function(err) {
                if(err) return done(err);
                imgurwrap.getImageData(uploadId, function(err ) {
                    (err.status).should.equal(404);
                    return done();
                });
            });
        });
    });
});
