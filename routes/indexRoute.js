const express = require('express');

const router = express.Router();

const indexGetController = require('../controllers/index/get');
const portfolioGetController = require('../controllers/portfolio/get');
const notificationGetController = require('../controllers/notification/get');
const settingsGetController = require('../controllers/settings/get');

const findChainByChainId = require('../controllers/chain/get');
const createChain = require('../controllers/chain/post');

const findImageUrlByKeybaseId = require('../controllers/keybase/post');

const getPostController = require('../controllers/session/get/post');
const setPostController = require('../controllers/session/set/post');

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

router.get(
    '/portfolio',
    portfolioGetController
);

router.get(
    '/notification',
    notificationGetController
);

router.get(
    '/settings',
    settingsGetController
);

router.post(
    '/keybase',
    findImageUrlByKeybaseId
);

router.post(
    '/session/get',
    getPostController
);

router.post(
    '/session/set',
    setPostController
);

module.exports = router;