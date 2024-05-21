const express = require('express');

const router = express.Router();

const indexGetController = require('../controllers/index/get');
const findChainByChainId = require('../controllers/index/findChainByChainId.js');

router.get('/',indexGetController);
// TODO: ikinci bir routea gerek yok
router.get('/chain/:chainId', findChainByChainId); // TODO: query kullan

module.exports = router;