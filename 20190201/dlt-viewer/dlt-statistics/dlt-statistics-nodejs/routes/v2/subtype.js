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

function getInfo(hid) {
    return new Promise(function(resolve, reject){
        conn.query('SELECT * FROM dlt.history_data where type=\'subtype\' and hid=?', hid,
            function (error, result) {
                if(error) {
                    reject(error);
                }
                else {
                    // console.log(result);
                    let att_attr = []
                    let arr_count = []
                    result.forEach(function (item, index, array) {
                        att_attr.push(item.attr);
                        arr_count.push(item.count);
                    });
                    resolve({ labels: att_attr, data: arr_count});
                }
            });
    });
}

router.get('/', function (req, res, next){
    // console.log(req.query.hid);
    getInfo(req.query.hid).then(function (json) {
        res.status(200).send({
            labels: json['labels'],
            data: json['data']
        });
    })

});

module.exports = router;
