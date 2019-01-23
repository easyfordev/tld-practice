const express = require('express');
const router = express.Router();
const store = require('./store');
const store2 = require('./store2');
const subtype = require('./subtype');

// const number = require('./number');
// const createFile = require('./create-file');

router.use('/store',store);
router.use('/subtype',subtype);
router.use('/store2',store2);

// router.use('/number',number);
// router.use('/file',createFile);

module.exports = router;
