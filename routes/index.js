var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    console.log("called index");
  res.render('index', { title: 'karaokegram' });
});

/* GET video page. */
router.get('/watch-video/:videoId', function(req, res) {
    var hostname = req.headers.host; // example: hostname = 'localhost:3000'
    var videoId = req.params.videoId

    var videoSrc = "http://" + hostname + "/videos/" + videoId;

    res.render('video', { title: 'karaokegram', 'videoSrc': videoSrc });
});

module.exports = router;
