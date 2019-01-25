var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/', function (req, res, next){

    let oldInterval, newInterval;
    var text = fs.readFileSync('../../dlt-viewer/hmc_dlt_statistics_config.ini', 'utf8');
    let arr = text.split(/\n| /);

    oldInterval = parseInt(arr[1])*1000 + parseInt(arr[3])*60000;

    newInterval =parseInt(req.body.interval_s)*1000 + parseInt(req.body.interval_m)*60000;

    if(newInterval != oldInterval){
        let data = "seconds "+ req.body.interval_s + "\n"+"minutes "+ req.body.interval_m;
        fs.writeFileSync('../../dlt-viewer/hmc_dlt_statistics_config.ini', data, 'utf8');
    }

    res.status(200).send();
});
module.exports = router;
