/*global describe, before, beforeEach, after, afterEach, it */
'use strict';
var imgurwrap = require('../../src/imgurwrap.js');
var chai = require('chai');

var should = chai.should();

imgurwrap.setClientID('eb5332f71090d90');

var albumId = 'PzWUu';

describe('imgurwrap', function() {
    describe('for an album', function() {
        it('should be able to load an album by id', function(done) {
            imgurwrap.getAlbumData(albumId, function(err, res) {
                if(err) return done(err);
                (res.model).should.equal('album');
                (res.success).should.be.true;
                (res.status).should.equal(200);
                (res.data.id).should.be.equal(albumId);
                (res.data.images.length).should.be.above(0);
                should.exist(res.data.cover);
                return done();
            });
        });
        it('should be able to load by URL', function(done) {
            var url = 'http://imgur.com/a/' + albumId;
            imgurwrap.getURLData(url, function(err, res) {
                if(err) return done(err);
                (res.model).should.equal('album');
                (res.success).should.be.true;
                (res.status).should.equal(200);
                (res.data.id).should.be.equal(albumId);
                (res.data.images.length).should.be.above(0);
                should.exist(res.data.link);
                return done();
            });
        });
    });
});
