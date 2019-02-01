/* es - single*/
var express = require('express');
var router = express.Router();
var request = require("request");

router.post('/', function (req, response, next){
    request({
        method: 'POST',
        url: 'http://localhost:9200/dlt_log/log1?pretty',
        headers: {
            'Content-Type': 'application/json'
        },
        body: req.body.mydata,
        json: true
    }, function(err, res, body) {
        if (err) {
            console.log(err);
            response.status(400).send();
        }
        //console.log(body);
        response.status(200).send({ status: res });
    });
});
module.exports = router;
