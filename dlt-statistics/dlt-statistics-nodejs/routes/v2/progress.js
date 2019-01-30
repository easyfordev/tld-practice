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
let idList1 = [];

router.get('/subtype', function (req, res, next){
    getIdList()
        .then(function(idList) {
            idList1 = idList;
            // console.log(idList1);
            return getQuery(idList);
        })
        .then(function (sql) {
            return getDataSubtype(sql);
        })
        .then(function(result) {
            res.status(200).send({
                data: result,
                hid: idList1
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
                    resolve(idList.sort((a, b) => a - b));
                }
            });
    });
}
function getQuery(idList) {
    return new Promise(function(resolve, reject){
        let sql = "";
        idList.forEach(function (item, index, array) {
            sql = sql + 'SELECT * FROM dlt.history_data where type="subtype" and hid=?;';
        });

        resolve(sql);
    });
}
function getDataSubtype(sql) {
    return new Promise(function(resolve, reject){
        // let sql = "";
        // idList.forEach(function (item, index, array) {
        //     sql = sql + 'SELECT * FROM dlt.history_data where type="subtype" and hid=?;';
        // });
        //
        // console.log(sql);
        conn.query(sql, idList1, function (error, results) {
            if(error) {
                reject(error);
            }
            else{
                let dictObject = {};
                results.forEach(function (item, index, array) {
                   // console.log(item); // 쿼리별 결과
                    if(index ===0){
                        item.forEach(function (it, id, arr) {
                           // console.log(it.attr + "  " + it.count);
                            // if(it.attr === ""){
                            //     dictObject["null"] = [it.count];
                            // }
                            dictObject[it.attr] = [it.count];
                        });
                    }
                    else{
                        item.forEach(function (it, id, arr) {
                           // console.log(it.attr + "  " + it.count);
                           //  if(it.attr === ""){
                           //      dictObject["null"] = [it.count];
                           //  }
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
