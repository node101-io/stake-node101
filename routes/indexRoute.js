const express = require('express');

const router = express.Router();

const indexGetController = require('../controllers/index/get');
const portfolioGetController = require('../controllers/portfolio/get');
const notificationGetController = require('../controllers/notification/get');
const settingsGetController = require('../controllers/settings/get');

const findChainByChainId = require('../controllers/chain/get');
const createChain = require('../controllers/chain/post');

const findImageUrlByKeybaseId = require('../controllers/keybase/post');



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


module.exports = router;