var express = require('express');
var router = express.Router();

const routes = {
    '/': { view: 'home', title: 'Altered Forest' },
    '/performers': { view: 'performers/index', title: 'Performers' },
    '/performers/visual': { view: 'performers/visual', title: 'Visual Performers' },
    '/performers/audio': { view: 'performers/audio', title: 'Audio Performers' },
    '/performers/the-tribe': { view: 'performers/tribe', title: 'The Tribe' }
}

for (const route in routes) {
    if (routes.hasOwnProperty(route)) {
        const { view, title } = routes[route];
        router.get(route, function (req, res, next) {
            res.render(view, { title });
        });
    }
}

// router.get('/tickets', function (req, res, next) {
//     res.render('tickets', { title: 'Altered Forest Tickets' });
// });

module.exports = router;
