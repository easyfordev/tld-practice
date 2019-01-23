var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'dlt'
});

/* GET home page. */
router.post('/test', function(req, res, next) {
  conn.connect();

  conn.query('select * from log', function(error, results, fields){
    if(error){
      console.log(error);
    }
    else{
      res.status(200).send({
        msg: results
      });
      console.log(results);
    }
  });

  conn.end();

  // res.render('index', { title: 'Express' });
});
let i=0;
router.get('/please', function(req, res, next){
  console.log("Received !!" + i++);
  res.status(200).send({
    msg : "OK"
  });
});

router.post('/please', function(req, res, next){
  console.log("Received !!" + i++);
  console.log(req.body.attr);
  res.status(200).send();
});

router.post('/store', function (req, res, next){
  console.log(req.body.dlt_index);
  console.log(req.body.ecuid);
  console.log(req.body.apid);
   console.log(req.body.subtype);
  console.log(req.body.time);
  res.status(200).send();
});
module.exports = router;
