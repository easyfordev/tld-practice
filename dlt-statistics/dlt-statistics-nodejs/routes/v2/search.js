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

router.get('/progress', function (req, res, next){
    getIdList()
        .then(function(idList) {
            return getDataFromId(idList);
        }).then(function(result) {
            res.status(200).send({
                data: result
            });
        })
});

module.exports = router;

function getIdList() {
    return new Promise(function(resolve, reject){
        // 시작 시간 구하기
        conn.query('SELECT hid FROM dlt.history_meta order by start_time desc limit 20', function (error, result) {
                if(error) {
                    reject(error);
                }
                else{
                    let idList = [];
                    result.forEach(function (item, index, array) {
                        idList.push(item.hid);
                    });
                    resolve(idList);
                }
            });
    });
}
function getDataFromId(idList) {
    return new Promise(function(resolve, reject){
        conn.query('SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?;' +
            'SELECT * FROM dlt.history_data where type="subtype" and hid=?', idList, function (error, results) {
            if(error) {
                reject(error);
            }
            else{
                let dictObject = {};
                results.forEach(function (item, index, array) {
                 //   console.log(item); // 쿼리별 결과
                    if(index ===0){
                        item.forEach(function (it, id, arr) {
                            dictObject[it.attr] = [it.count]
                        });
                    }
                    else{
                        item.forEach(function (it, id, arr) {
                            dictObject[it.attr].push(it.count);
                        });
                    }
                   //console.log(item);
                    //dictObject[item.attr].push(item.count);
                });
                resolve(dictObject);
            }
        });
    });
}
