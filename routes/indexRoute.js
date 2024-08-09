const express = require('express');

const router = express.Router();

const indexGetController = require('../controllers/index/get');
const findChainByChainId = require('../controllers/chain/get');
const createChain = require('../controllers/chain/post');

router.get(
    '/',
    indexGetController
);
router.get(
    '/chain',
    findChainByChainId
);

router.post(
    '/chain',
    createChain
);

module.exports = router;