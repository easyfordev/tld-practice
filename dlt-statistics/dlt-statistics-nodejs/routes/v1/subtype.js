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

let labels = [];
let data = [];

function getInfo() {
    return new Promise(function(resolve, reject){
        conn.query('SELECT count(*) as count FROM dlt.log where subtype="info"',
            function (error, result) {
                if(error) {
                    res.status(400).send({
                        status: "fail",
                        msg: error
                    });
                }
                else {
                    labels.push("info");
                    data.push(result[0].count);
                    resolve();
                }
            });
    });
}
function getWarn() {
    return new Promise(function(resolve, reject){
        conn.query('SELECT count(*) as count FROM dlt.log where subtype="warn"',
            function (error, result) {
                if(error) {
                    res.status(400).send({
                        status: "fail",
                        msg: error
                    });
                }
                else {
                    labels.push("warn");
                    data.push(result[0].count);
                    resolve();
                }
            });
    });
}
function getError() {
    return new Promise(function(resolve, reject){
        conn.query('SELECT count(*) as count FROM dlt.log where subtype="error"',
            function (error, result) {
                if(error) {
                    res.status(400).send({
                        status: "fail",
                        msg: error
                    });
                }
                else {
                    labels.push("error");
                    data.push(result[0].count);
                    resolve();
                }
            });
    });
}

router.post('/', function (req, res, next){
    getInfo().then(function () {
        return getWarn();
    }).then(function () {
        return getError();
    }).then(function () {
        res.status(200).send({
            labels: labels,
            data: data
        });
        labels = []
        data = []
    })

});

module.exports = router;
