var express = require('express');
var router = express.Router();
var contactRouter = require('./contact');

router.use(contactRouter);

const routes = {
    '/': { view: 'home', title: 'Altered Forest' },
    '/performers': { view: 'performers/index', title: 'Performers' },
    '/performers/visual': { view: 'performers/visual', title: 'Visual Performers' },
    '/performers/audio': { view: 'performers/audio', title: 'Audio Performers' },
    '/performers/the-tribe': { view: 'performers/tribe', title: 'The Tribe' },
    '/news': { view: 'news', title: 'News' },
    '/location': { view: 'location', title: 'Location' },
    '/gallery': { view: 'gallery/index', title: 'Gallery' },
    '/gallery/af2018': { view: 'gallery/af2018', title: 'Gallery' },
    '/info': { view: 'info/', title: 'More Info' },
    '/info/tips': { view: 'info/tips', title: 'Tips' },
    '/info/applications': { view: 'info/applications', title: 'Applications' },
    '/info/contact': { view: 'info/contact', title: 'Contact' },
    '/info/camping': { view: 'info/camping', title: 'Camping Rules' },
}

for (const route in routes) {
    if (routes.hasOwnProperty(route)) {
        const { view, title } = routes[route];
        router.get(route, function (req, res, next) {
            res.render(view, Object.assign({ title }, res.locals));
        });
    }
}


// router.get('/tickets', function (req, res, next) {
//     res.render('tickets', { title: 'Altered Forest Tickets' });
// });

module.exports = router;
