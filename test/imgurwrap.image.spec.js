/*global describe, before, beforeEach, after, afterEach, it */
'use strict';
var imgurwrap = require('../src/imgurwrap.js');
var request = require('request');
var should = require('should');

imgurwrap.setClientID('eb5332f71090d90');

var imageId = 'a9uzvgf';
var imageId2 = 'G80OxqS';

describe('imgurwrap', function() {
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
});