var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var request = require("request");

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'easy88ch',
    database: 'dlt',
    multipleStatements: true
});
conn.connect();

let initTime  = new Date();
let newTime;
let interval, interval_s, interval_m;
let oldt, newt;
let i=0;
// conn.query('SELECT time FROM dlt.log where dlt_index = 0 order by id desc limit 1',
//     function (error, result) {
//     if(error) { throw error; }
//     else{
//         initTime = result[0].time;
//         newTime = new Date(initTime.getTime());
//     }
// });
router.post('/', function (req, res, next){
    if(i===0){
        getInitTime();
        i++;
    }
    getInterval()
        .then(function() {
            return insertMeta();
        }).then(function (lastid) {
            return insertSubtype(lastid);
        }).then(function (lastid) {
            return insertApid(lastid);
        }).then(function (lastid) {
            return insertEcuid(lastid);
        }).then(function () {
            res.status(200).send({
                msg: "OK"
            });
        }).catch( function(err){
            res.status(404).send({
                msg: err
            });
        })
});

module.exports = router;
// 시작시간, 주기 구하기
function getInitTime() {
    return new Promise(function(resolve, reject){
        // 시작 시간 구하기
        conn.query('SELECT time FROM dlt.log where dlt_index = 0 order by id desc limit 1',
            function (error, result) {
                if(error) {
                    reject(error);
                }
                else{
                    initTime = result[0].time;
                    newTime = new Date(initTime.getTime());
                    resolve();
                }
        });
    });
}
function getInterval() {
    return new Promise(function(resolve, reject){
        // 주기 구하기
        request({
            method: 'GET',
            url: 'http://localhost:3000/v1/interval',
            json: true
        }, function(err, myres, body) {
            if (err) {
                reject(err);
            }
            interval = myres.body['interval'];
            interval_s = myres.body['interval_s'];
            interval_m = myres.body['interval_m'];
            resolve();
        });
    });
}
// 끝 시간 구해서 meta 테이블에 Insert 하기
// meta 테이블에서 아이디 얻기
function insertMeta() {
        return new Promise(function(resolve, reject){
            // prevTime.setSeconds(0);
            let oldTime = new Date(newTime.getTime());
            if(interval < 60000){
                newTime.setSeconds(newTime.getSeconds()+ interval_s);
            } else {
                newTime.setMinutes(newTime.getMinutes()+ interval_m);
                newTime.setSeconds(newTime.getSeconds()+ interval_s);
            }

            oldt = oldTime.toISOString().replace(/T.+/, '') + " "+ oldTime.getHours()+":"+oldTime.getMinutes() + ":"+oldTime.getSeconds();
            newt = newTime.toISOString().replace(/T.+/, '') + " "+ newTime.getHours()+":"+newTime.getMinutes() + ":"+newTime.getSeconds();

            conn.query(
            'insert into history_meta(start_time, end_time, itv) values(?,?,?); SELECT LAST_INSERT_ID() as lastid',
            [oldt.toString(), newt.toString(), interval],
            function (error, result) {
                if(error) {
                    console.log(error);
                    reject(error);

                }
                else{
                    resolve(result[1][0].lastid);
                }
            });
        });
}
// 아이디 얻어서 log에서 쿼리하고, 바로 history_data 테이블로 insert 하기 => type마다 각자 수행, 총 3번 반복
function insertSubtype(lastid) {
    return new Promise(function(resolve, reject){
        conn.query(
            'Insert into history_data(hid, type, attr, count)' +
            'SELECT ?, ?, subtype, count(*) as count ' +
            'FROM log ' +
            'where time between ? and ? ' +
            'Group by subtype ' +
            'order by count desc ',
            [lastid, "subtype", oldt, newt],
            function (error, result) {
                if(error) {
                    console.log(error);
                    reject(error);
                }
                resolve(lastid);
            });
    });
}
function insertApid(lastid) {
    return new Promise(function(resolve, reject){
        conn.query(
            'Insert into history_data(hid, type, attr, count) ' +
            'SELECT ?, ?, apid, count(*) as count ' +
            'FROM log ' +
            'where time between ? and ? ' +
            'Group by apid ' +
            'order by count desc ',
            [lastid, "apid", oldt, newt],
            function (error, result) {
                if(error) {
                    console.log(error);
                    reject(error);
                }
                resolve(lastid);
            });
    });
}
function insertEcuid(lastid) {
    return new Promise(function(resolve, reject){
        conn.query(
            'Insert into history_data(hid, type, attr, count) ' +
            'SELECT ?, ?, ecuid, count(*) as count ' +
            'FROM log '+
            'where time between ? and ? ' +
            'Group by ecuid ' +
            'order by count desc ',
            [lastid, "ecuid", oldt, newt],
            function (error, result) {
                if(error) {
                    console.log(error);
                    reject(error);
                }
                resolve();
            });
    });
}
