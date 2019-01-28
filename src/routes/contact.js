var express = require("express");
var router = express.Router();
var { sendEmail } = require('../services/emailService');

router.post('/info/contact', (req, res, next) => {
    sendEmail(req.body.sender, req.body.subject, req.body.body)
    .then(() => {
        res.redirect('/info/contact?message=info.contact.success&reply=' + req.body.sender);
    })
    .catch((err) => {
        console.error("Error while sending email: ")
        console.error(err);
        res.redirect('/info/contact?message=info.contact.error&flashType=error');
    });
});

router.get('/info/contact', (req, res, next) => {
    if (req.query.message) {
        res.locals.flashMessage = {
            text: req.query.message,
            type: req.query.flashType
        }
    }
    next();
})

// router.get('/tickets', function (req, res, next) {
//     res.render('tickets', { title: 'Altered Forest Tickets' });
// });

module.exports = router;
