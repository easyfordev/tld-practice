/* mysql - single */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'dlt'
});
conn.connect();

router.post('/', function (req, res, next){
    // console.log(req.body.dlt_index);
    // console.log(req.body.ecuid);
    // console.log(req.body.apid);
    // console.log(req.body.subtype);
    // console.log(req.body.time);
    conn.query('insert into log(dlt_index, ecuid, apid, subtype, time) values(?,?,?,?,?)',
        [req.body.dlt_index, req.body.ecuid, req.body.apid, req.body.subtype, req.body.time],
        function (error, result) {
        if(error) {
            res.status(400).send({
                status: "fail",
                msg: error
            });
        }
        else {
            res.status(200).send();
        }

        });
});
module.exports = router;
