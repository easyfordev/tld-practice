const express = require('express');
const router = express.Router();
const store = require('./store');
const search = require('./search');
const progress = require('./progress');
const subtype = require('./subtype');
const ecuid = require('./ecuid');
const apid = require('./apid');

router.use('/history/store',store);
router.use('/history/search',search);
router.use('/history/progress',progress);
router.use('/subtype',subtype);
router.use('/ecuid',ecuid);
router.use('/apid',apid);

module.exports = router;
