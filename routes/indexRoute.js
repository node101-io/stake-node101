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

/***** TEMPORARY */

router.get(
    '/notification',
    (req, res) => {
        res.render('index/notification', {
            page: 'index/notification',
            title: res.__('For you to make most of the distributed value'),
            includes: {
                external: {
                    css: ['general', 'header', 'sidebar', 'stake', 'page'],
                    js: ['cosmjs', 'page', 'serverRequest']
                },
                meta: {
                    title: res.__('For you to make most of the distributed value'),
                    description: res.__('World is changing, and there are a lot of new values emerging with blockchain technology. Now, it is the time to _distribute_ the value. node101 is validating and distributing the value in more than 15 blockchains, all with different visions for their community. To discover and learn more how you can join the distributed ecosystem, reach out at hello@node101.io.'),
                    image: '/res/images/open-graph/header.png',
                    twitter: true
            },
        },
    });
  }
);
     
router.get(
    '/portfolio',
    (req, res) => {
        res.render('index/portfolio', {
            page: 'index/portfolio',
            title: res.__('For you to make most of the distributed value'),
            includes: {
                external: {
                    css: ['general', 'header', 'sidebar', 'stake', 'page'],
                    js: ['cosmjs', 'page', 'serverRequest']
                },
                meta: {
                    title: res.__('For you to make most of the distributed value'),
                    description: res.__('World is changing, and there are a lot of new values emerging with blockchain technology. Now, it is the time to _distribute_ the value. node101 is validating and distributing the value in more than 15 blockchains, all with different visions for their community. To discover and learn more how you can join the distributed ecosystem, reach out at hello@node101.io.'),
                    image: '/res/images/open-graph/header.png',
                    twitter: true
            },
        },
    });
  }
);


router.get(
    '/settings',
    (req, res) => {
        res.render('index/settings', {
            page: 'index/settings',
            title: res.__('For you to make most of the distributed value'),
            includes: {
                external: {
                    css: ['general', 'header', 'sidebar', 'stake', 'page'],
                    js: ['cosmjs', 'page', 'serverRequest']
                },
                meta: {
                    title: res.__('For you to make most of the distributed value'),
                    description: res.__('World is changing, and there are a lot of new values emerging with blockchain technology. Now, it is the time to _distribute_ the value. node101 is validating and distributing the value in more than 15 blockchains, all with different visions for their community. To discover and learn more how you can join the distributed ecosystem, reach out at hello@node101.io.'),
                    image: '/res/images/open-graph/header.png',
                    twitter: true
            },
        },
    });
  }
);
     


        
module.exports = router;