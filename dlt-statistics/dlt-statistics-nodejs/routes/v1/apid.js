var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'easy88ch',
    database: 'dlt'
});
conn.connect();

let labels = [];
let data = [];

function getInfo() {
    return new Promise(function(resolve, reject){
        conn.query('SELECT apid, count(*) as count FROM log Group by apid order by count desc',
            function (error, result) {
                if(error) {
                    res.status(400).send({
                        status: "fail",
                        msg: error
                    });
                }
                else{
                    result.forEach(function (item, index, array) {
                        labels.push(item["apid"]);
                        data.push(item["count"]);
                    });
                    resolve();
                }
            });
    });
}

router.get('/', function (req, res, next){
    getInfo().then(function () {
        res.status(200).send({
            received : req.body,
            labels: labels,
            data: data
        });
        labels = []
        data = []
    })

});

module.exports = router;
// label : SELECT DISTINCT(apid) FROM log
// SELECT apid, count(*) FROM log Group by apid
