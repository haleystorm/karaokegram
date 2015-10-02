var express = require('express');
var router = express.Router();

/* GET search results */
router.get('/', function(req, res) {

    var API_KEY = req.API_KEY;
    var youtube = req.youtube;
    var query = 'dog';

    if(req.query.q === '') {
        // They didn't specify a search term so they are getting dog videos...
    } else {
        query = req.query.q;
    }

    var params = {
        auth: API_KEY,
        part: 'id,snippet',
        q: query,
        maxResults: 3
    };

    youtube.search.list(params, function (err, response) {
        if(err) {
            console.log('Encountered error', err);
            res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
        } else {
            var result = [];

            for(var i in response.items) {
                var item = response.items[i];
                result.push({id: item.id.videoId, title: item.snippet.title, description: item.snippet.description});
            }
            
            res.json(result);
        }
    });
});

module.exports = router;
