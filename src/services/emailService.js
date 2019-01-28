var mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
var mailcomposer = require('mailcomposer');

var CONTACT_EMAIL = "rom1guyot+af2019@protonmail.com";

exports.CONTACT_EMAIL = CONTACT_EMAIL;

exports.emailMiddleware = function () { return function (req, res, next) {
    res.locals.contact = CONTACT_EMAIL;
    next();
}; }

exports.sendEmail = function (sender, subject, body) {
    return new Promise(function (resolve, reject) {
        if (!sender || !subject) {
            reject(new Error('Some required fields are missing!'))
        }
        var mail = mailcomposer({
            from: sender,
            to: CONTACT_EMAIL,
            subject,
            body,
            html: body
        });

        mail.build(function (err, message) {
            if (err) { return reject(err); }
            var dataToSend = {
                to: CONTACT_EMAIL,
                message: message.toString('ascii')
            };

            mailgun.messages().sendMime(dataToSend, function (error, body) {
                if (error) { reject(error); }
                else { resolve(); }
            });
        });
    });
}
