const express = require('express');

const router = express.Router();

const indexGetController = require('../controllers/index/get');
const findChainByChainId = require('../controllers/index/findChainByChainId.js');

router.get('/',indexGetController);
router.get('/chain/:chainId', findChainByChainId);

module.exports = router;