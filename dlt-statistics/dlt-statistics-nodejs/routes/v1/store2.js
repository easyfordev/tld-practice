/* mysql - bulk */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var request = require("request");

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'easy88ch',
    database: 'dlt'
});
conn.connect();

router.post('/', function (req, res, next){
    var sql = "insert into log(dlt_index, ecuid, apid, subtype, time) values ?";

    var values = req.body.postdata;
    // console.log(values);
   // res.status(200).send();

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
    })
});
// router.post('/', function (req, res, next){
//
//     let len = req.body.postdata.length;
//     let data = req.body.postdata;
//
//     for(let i=0;i<len;i++){
//         // console.log(data[i]);
//         conn.query('insert into log(dlt_index, ecuid, apid, subtype, time) values(?,?,?,?,?)',
//             [data[i].dlt_index, data[i].ecuid, data[i].apid, data[i].subtype, data[i].time],
//             function (error, result) {
//                 if(error) {
//                     res.status(400).send({
//                         status: "fail",
//                         msg: error
//                     });
//                 }
//             });
//     }
//     res.status(200).send();
// });

module.exports = router;
