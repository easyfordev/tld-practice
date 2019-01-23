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

    // for(int =0; i<len ; i++){
    //     console.log(i);
    // }

    // conn.query('insert into log(dlt_index, ecuid, apid, subtype, time) values(?,?,?,?,?)',
    //     [req.body.dlt_index, req.body.ecuid, req.body.apid, req.body.subtype, req.body.time],
    //     function (error, result) {
    //     if(error) {
    //         res.status(400).send({
    //             status: "fail",
    //             msg: error
    //         });
    //     }
    //     else {
    //         res.status(200).send();
    //     }
    //
    //     });
});
module.exports = router;
