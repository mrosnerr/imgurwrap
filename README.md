[![Build Status](https://travis-ci.org/msrxthr/imgurwrap.svg)](https://travis-ci.org/msrxthr/imgurwrap)

# imgurwrap

### Description

Imgurwrap is a node.js module for making requests against the Imgur API.

Supports querying the API for image and album data by ID or URL.

## How to use

Start by requiring the module

```javascript
imgurwrap = require('imgurwrap.js');
```

#### Basic configuration

* [Register with Imgur](https://api.imgur.com/#register) to get a ClientID for your application.


```javascript
imgurwrap.setUserAgent('imgurwrap default useragent v1.1'); // Replace with your UserAgent
imgurwrap.setClientID('eb534344da354de40d90'); // Replace with your CleintID
```


#### Data models returned by the API
* [Image](https://api.imgur.com/models/image)
* [Album](https://api.imgur.com/models/album)


##### 1. Request an image by ID

```javascript
imgurwrap.getImageData('lEVc0PF', function(err, res) {
    console.log(res);
});
```

##### 2. Request an album by ID

```javascript
imgurwrap.getAlbumData('PzWUu', function(err, res) {
    console.log(res);
});
```

##### 3. Request an image, multiple images, or an album by URL

The returned model property will be either 'image', 'images', or 'album'

```javascript
imgurwrap.getURLData('http://imgur.com/lEVc0PF', function(err, res) {
    console.log(res);
    console.log(res.model); // Prints out 'image'
});

imgurwrap.getURLData('http://imgur.com/lEVc0PF,G80OxqS', function(err, res) {
    console.log(res);
    console.log(res.model); // Prints out 'images'
    console.log(res.images[0].model); // Prints out 'image'
});

imgurwrap.getURLData('http://imgur.com/a/PzWUu', function(err, res) {
    console.log(res);
    console.log(res.model); // Prints out 'album'
});

```
#### For commercial usage, Mashape can be utilized for making requests.

* [Register with Mashape](https://www.mashape.com/imgur/imgur-9) to get a MashapeAuthID for your application.

```javascript
// Replace with your MashapeAuthID
imgurwrap.setMashapeAuthID('cXs47w356nWDx2k9E34G36j4ZHBAdxmZ');
```

Note that on setting the MashapeAuthID, the endpoint used for making requests will automaticaly be
updated to point to the Mashape Imgur endpoint (i.e. https://imgur-apiv3.p.mashape.com/).



#### Available configuration options

* [Register with Imgur](https://api.imgur.com/#register) to get a ClientID for your application.
* [Register with Mashape](https://www.mashape.com/imgur/imgur-9) to get a MashapeAuthID for your application.

```javascript
// Replace with your CleintID
imgurwrap.setClientID('eb534344da354de40d90');

// Replace with your MashapeAuthID
imgurwrap.setMashapeAuthID('cXs47w356nWDx2k9E34G36j4ZHBAdxmZ');

imgurwrap.setUserAgent('imgurwrap default useragent v1.1');
imgurwrap.setApiHost('https://api.imgur.com');
imgurwrap.setApiVersion(3);
```
