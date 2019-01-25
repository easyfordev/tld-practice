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

router.post('/', function (req, res, next){

    let len = req.body.postdata.length;
    let data = req.body.postdata;

    for(let i=0;i<len;i++){
        // console.log(data[i]);
        conn.query('insert into log(dlt_index, ecuid, apid, subtype, time) values(?,?,?,?,?)',
            [data[i].dlt_index, data[i].ecuid, data[i].apid, data[i].subtype, data[i].time],
            function (error, result) {
            if(error) {
                res.status(400).send({
                    status: "fail",
                    msg: error
                });
            }
        });
    }
    res.status(200).send();
});
module.exports = router;
