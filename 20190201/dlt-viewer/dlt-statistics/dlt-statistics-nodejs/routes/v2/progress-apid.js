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
let idList1 = [];

router.get('/', function (req, res, next){
    getIdList()
        .then(function(idList) {
            idList1 = idList;
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
        .catch(function (msg) {
            if(msg.toString() === "empty"){
                res.status(200).send({
                    data: [],
                    hid: []
                });
            }
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
        let sql = '';

        let len = idList.length;

        if(len === 0){
            console.log("0개도 들어온다 !!!!");
            reject("empty");
        } else if(len === 1){
            sql = 'SELECT * FROM dlt.history_data where type="apid" and hid=?;';
        } else {
            for(let i=0;i<len; i++){
                sql = sql + 'SELECT * FROM dlt.history_data where type="apid" and hid=?;';
            }
        }
        resolve(sql);
    });
}
function getDataSubtype(sql) {
    return new Promise(function(resolve, reject){

        conn.query(sql, idList1, function (error, results) {
            if(error) {
                reject(error);
            }
            else{
                let dictObject = {};
                let attrs = [];

                if(idList1.length === 1){
                    // console.log("길이가 1이잖아유.. ");
                    results.forEach(function (item, index, array) {
                        // console.log(item);
                        dictObject[item.attr] = [item.count];
                        attrs.push(item.attr);
                    });
                    resolve(dictObject);
                } else {
                    results.forEach(function (item, index, array) {
                        // console.log(item);
                        if(index === 0){
                            item.forEach(function (it, id, arr) {
                                dictObject[it.attr] = [it.count];
                                attrs.push(it.attr);
                            });
                        }
                        else{
                            let checks = [];
                            item.forEach(function (it, id, arr) {
                                checks.push(it.attr);
                            });

                            // 기존에 나왔었는데, 이번에는 안나오면? 0을 넣기
                            attrs.forEach(function (atom, id, arr) {
                                if(!checks.includes(atom)) {
                                    dictObject[atom].push(0);
                                }
                            });
                            item.forEach(function (it, id, arr) {
                                // 한번도 안나왔던 attr이 나왔을 때 처리
                                if(!dictObject[it.attr]){
                                    attrs.push(it.attr);
                                    dictObject[it.attr] = [];
                                    for(let i=0;i<index;i++){
                                        dictObject[it.attr].push(0);
                                    }
                                }
                                dictObject[it.attr].push(it.count);
                            });
                        }
                    });
                    resolve(dictObject);
                }
            }
        });
    });
}
