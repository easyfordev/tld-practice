/* mysql - bulk */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var request = require("request");

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'dlt'
});
conn.connect();

router.post('/', function (req, res, next){
    var sql = "insert into log(dlt_index, ecuid, apid, subtype, time) values ?";

    var values = req.body.postdata;
    //
    // console.log(values[0][0]);
    // console.log(myvar);

    if(req.body.postdata.length === 0){
        res.status(200).send();
        return ;
    }

    conn.query(sql, [values], function (err) {
        if(err){
            res.status(400).send({
                msg: err
            })
        }
        request({
            method: 'POST',
            url: 'http://localhost:3000/v2/history/store',
            json: true
        }, function(err, myres) {
            if (err) {
                res.status(400).send({
                    msg: err
                });
            }
            res.status(200).send();
        });
    });

    if(values[0][0] === '0'){
        console.log("IF문을 탄다!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        getInitTime().then(function (result) {
            clientInitTime = result[0].time;
            oldTime = new Date(clientInitTime.getTime());
        });
    }
});

module.exports = router;

function getInitTime() {
    return new Promise(function(resolve, reject){
        // 시작 시간 구하기
        conn.query('SELECT time FROM dlt.log where dlt_index = 0 order by id desc limit 1',
            function (error, result) {
                if(error) {
                    reject(error);
                }
                else{
                    // console.log(result);
                    // clientInitTime = result[0].time;
                    // oldTime = new Date(clientInitTime.getTime());
                    resolve(result);
                }
            });
    });
}
