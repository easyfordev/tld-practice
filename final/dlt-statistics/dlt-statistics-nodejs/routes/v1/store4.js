var express = require('express');
var router = express.Router();
var request = require("request");

router.get('/', function (req, response, next){
    response.status(200).send();
    console.log(req.body);
    // console.log(req.text);
    // request({
    //     method: 'POST',
    //     url: 'http://localhost:9200/dlt_log/log1/_bulk?pretty',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: req.body,
    //     json: true
    // }, function(err, res, body) {
    //     if (err) {
    //         console.log(err);
    //         response.status(400).send();
    //     }
    //     //console.log(body);
    //     response.status(200).send({ status: res });
    // });
});

module.exports = router;
/* es - bulk */
