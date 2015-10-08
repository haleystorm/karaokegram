var express = require('express');
var router = express.Router();

/* POST video */
router.post('/', function(req, res) {
    
    var upload = req.upload.single('video.webm');
    var transporter = req.transporter;
    var sender = req.sender;

    upload(req, res, function (err) {

        if (err) {
            // An error occurred when uploading
            console.log('Encountered error', err);
            res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
        } else {
            // Everything went fine
            var senderName = req.body.username;
            var recipientName = req.body.friendname;
            var recipientEmail = req.body.friendemail;

            var hostname = req.headers.host; // example: hostname = 'localhost:3000'
            var videoUrl = "http://" + hostname + "/watch-video/" + req.file.filename;

            var htmlBody = '';
            htmlBody+='Hello ' + recipientName + ',';
            htmlBody+='</br>';
            htmlBody+='<p>' + senderName + ' has sent you a karaokegram!</p>';
            htmlBody+='</br>';
            htmlBody+='<p>';
            htmlBody+='Please click here to see your karaokegram ';
            htmlBody+='<a href=' + videoUrl + '>';
            htmlBody+=videoUrl;
            htmlBody+='</a>';
            htmlBody+='</p>';

            // setup e-mail data
            var mailOptions = {
                from:  'karaokegram ' + sender, // sender address
                to: recipientEmail, // receiver
                subject: senderName + ' sent you a karaokegram', // Subject line
                text: 'Please click the link to see your video: ' + videoUrl, // plaintext body
                html: htmlBody  // html body
            };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    // An error occurred when emailing
                    console.log('Encountered error', error);
                    res.send((error === null) ? { msg: '' } : { msg: 'error: ' + error });
                } else {
                     console.log('Message sent: ' + info.response);
                     res.send({ msg:'' });
                }
            });
        }
    });
});

module.exports = router;
