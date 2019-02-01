var express = require('express');
var router = express.Router();
var fs = require('fs');

let oldInterval, newInterval;

router.post('/', function (req, res, next){


    var text = fs.readFileSync('../../dlt-viewer/hmc_dlt_statistics_config.ini', 'utf8');
    let arr = text.split(/\n| /);

    oldInterval = parseInt(arr[1])*1000 + parseInt(arr[3])*60000;

    newInterval = parseInt(req.body.interval_s)*1000 + parseInt(req.body.interval_m)*60000;

    if(newInterval != oldInterval){
        let data = "seconds "+ req.body.interval_s + "\n"+"minutes "+ req.body.interval_m;
        fs.writeFileSync('../../dlt-viewer/hmc_dlt_statistics_config.ini', data, 'utf8');
    }
    res.status(200).send();
});

router.get('/', function(req, res, next){
    fs.readFile('../../dlt-viewer/hmc_dlt_statistics_config.ini', 'utf8', (err, data) => {
        if (err)
            throw err;
        var text = data.toString();
        let arr = text.split(/\n| /);
        oldInterval = parseInt(arr[1])*1000 + parseInt(arr[3])*60000;

        res.status(200).send({
            interval_s : parseInt(arr[1]),
            interval_m:  parseInt(arr[3]),
            interval: oldInterval

        });
    });
});

module.exports = router;
