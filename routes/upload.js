var express = require('express');
var router = express.Router();

/* POST video */
router.post('/', function(req, res) {
    
    var upload = req.upload.single('video.webm');

    upload(req, res, function (err) {

        if (err) {
            // An error occurred when uploading
            console.log('Encountered error', err);
            res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
        } else {
            // Everything went fine
            var senderName = req.body.username;
            var senderEmail = req.body.email;
            var recipientName = req.body.friendname;
            var recipientEmail = req.body.friendemail;

            console.log(req.body);

            console.log(req.file.originalname);
            console.log(req.file.filename);

            res.send({ msg:'' });
        }
    });
});

module.exports = router;
