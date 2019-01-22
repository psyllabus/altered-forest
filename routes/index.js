var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home', { title: 'Altered Forest' });
});
// router.get('/tickets', function (req, res, next) {
//     res.render('tickets', { title: 'Altered Forest Tickets' });
// });

module.exports = router;
