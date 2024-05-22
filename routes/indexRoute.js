const express = require('express');

const router = express.Router();

const indexGetController = require('../controllers/index/get');
const findChainByChainId = require('../controllers/chain/get');

router.get('/',indexGetController);
router.get('/chain', findChainByChainId); 

module.exports = router;