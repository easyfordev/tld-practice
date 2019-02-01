const express = require('express');
const router = express.Router();
const store = require('./store');
const store2 = require('./store2');
const store3 = require('./store3');
const store4 = require('./store4');
const subtype = require('./subtype');
const interval = require('./interval');
const apid = require('./apid');
const ecuid = require('./ecuid');

router.use('/store',store);
router.use('/subtype',subtype);
router.use('/store2',store2);
router.use('/store3',store3);
router.use('/store4',store4);
router.use('/interval',interval);
router.use('/apid',apid);
router.use('/ecuid',ecuid);


module.exports = router;
