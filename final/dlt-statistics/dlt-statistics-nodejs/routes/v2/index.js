const express = require('express');
const router = express.Router();
const store = require('./store');
const search = require('./search');
const progress1 = require('./progress-subtype');
const progress2 = require('./progress-apid');
const progress3 = require('./progress-ecuid');

const subtype = require('./subtype');
const ecuid = require('./ecuid');
const apid = require('./apid');

router.use('/history/store',store);
router.use('/history/search',search);
router.use('/history/progress/subtype',progress1);
router.use('/history/progress/apid',progress2);
router.use('/history/progress/ecuid',progress3);

router.use('/subtype',subtype);
router.use('/ecuid',ecuid);
router.use('/apid',apid);

module.exports = router;
