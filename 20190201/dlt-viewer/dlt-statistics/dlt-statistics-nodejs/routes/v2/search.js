var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var request = require("request");

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'dlt',
    multipleStatements: true
});
conn.connect();

router.get('/meta', function (req, res, next){
    conn.query('SELECT hid, DATE_FORMAT(start_time, \'%Y-%m-%d %H:%i:%s\') as start_time,DATE_FORMAT(end_time, \'%Y-%m-%d %H:%i:%s\') as end_time, itv ' +
        'FROM dlt.history_meta order by start_time desc limit 20',
        function (error, result) {
            if(error) {
                res.status(400).send({
                    error: error
                });
            }
            res.status(200).send({
                data: result
            });
    });
});

module.exports = router;
