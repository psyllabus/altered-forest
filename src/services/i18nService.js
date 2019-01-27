var express = require("express");
var router = express.Router();

router.get('/:lang', function (req, res, next) {
    res.cookie('lang', req.params.lang);
    res.redirect(req.query.url || '/');
});

function getTranslate(lang) {
    const translate = function (key, depth) {
        if (depth > MAX_REF_CHAIN) {
            return `${lang}: max ref chain exceeded (${depth}) - last key: ${key}`;
        }

        var translation = translations
        var keys = key.split('.');
        if (translation[key] && translation[key].en) { translation = translation[key]; }
        else {
            for (var k = 0; k < keys.length; k++) {
                if (!translation[keys[k]]) { translation = { en: 'Untranslated key: ' + key }; }
                else { translation = translation[keys[k]]; }
            }
        }

        if (translation[lang]) {
            return translation[lang];
        }
        if (translation._ref) { return translate(translation._ref, (depth || 0) + 1); }

        return `${lang}: ${translation.en}`;
    };
    return translate;
}

exports.i18nMiddleware = function (app) {
    app.use('/lang', router);
    return function (req, res, next) {
        req.lang = req.signedCookies.lang || req.cookies.lang || "en";
        res.locals.url = req.path;
        res.locals.translate = getTranslate(req.lang);
        res.locals.lang = req.lang;
        next();
    };
}

exports.availableLanguages = [{id: 'en', label: 'English'}, {id: 'fr', label: 'Francais'}];

/**
 * List of available translations
 * TODO: Move that to its own js file
 * Translations are stored by nested key, the last object must hold at least
 * the entry `en` and as many languages as supported.
 * Alternatively it can contains an entry `_ref` that *must* reference an
 * existing key that hold at least an entry `en` as its leaf.
 */
var translations = {
    nav: {
        performers: {
            title: { en: 'Performers', fr: 'Programmation'},
            visual: { en: 'Visual Performers', fr: 'Programmation Visuelle' },
            audio: { en: 'Audio Performers', fr: 'Programmation Musicale' },
            tribe: { en: 'The Tribe', fr: 'La Tribue' }
        },
        news: { en: 'News', fr: 'Nouvelles' },
        location: { en: 'Location', fr: 'Emplacement' },
        gallery: { en: 'Gallery', fr: 'Gallerie' },
        info: {
            title: { en: 'More Info', fr: 'Infos' },
            tips: { en: 'Tips', fr: 'Astuces' },
            camping: { en: 'Camping Rules', fr: 'Reglement Camping' },
            contact: { en: 'Contact', fr: 'Contact' },
            applications: { en: 'Applications', fr: 'Candidature' },
        },
        tickets: { en: 'Tickets', fr: 'Billets' }
    },
    home: {
        days: { en: 'Days', fr: 'jours' },
        hours: { en: 'Hours', fr: 'Heures' },
        minutes: { en: 'Minutes', fr: 'Minutes' },
        seconds: { en: 'Seconds', fr: 'Secondes' },
        vision: {
            title: { en: 'Vision', fr: 'Vision' },
            description: {
                en: 'We are committed to bringing quality underground music, mind altering psychedelic art, professionalism and outrageous laughter. Striving to create unique atmospheres at every event, we grow stronger and more dedicated with every session. Altered State, our monthly jam, has been going strong now for over 3 years now. This year Psyllabus has teamed up with scores of interesting local artists, musicians, spaces and squid to present to Canada the third iteration of Altered Forest. Canada\'s only adventure psytrance festival.',
                fr: 'Nous sommes engages a fournir musique underground de qualité, art psychédélique a faire tourner la tête, professionnalisme et humour indécent. Nous nous efforçons de créer des atmosphères uniques a chacun de nos évènements, nous devenons plus forts et plus passionnés apres chaque session. Altered State, notre évènement mensuel, continue d\'être reclamme avec succes depuis maintenant trois ans. Cette annee Psyllabus s\'est uni avec les plus interessants artistes locaux, musiciens et decorateurs pour presenter au Canada la troisieme edition d\'Altered Forest. Le seul festival d\'aventure psytrance au Canada.',
            }
        }
    },
    performers: {
        title: { _ref: 'nav.performers.title' },
        description: { en: 'Get to know the team working together to alter y\'all!!', fr: 'Apprenez a connaitre l\'equipe chargee de vous alterer le week-end !' },
        audio: {
            title: { _ref: 'nav.performers.audio' },
            description: { en: 'A team of dedicated musicians and sound wizards who brewed their best tracks to tickle both your ears and your brain!' }
        },
        visual: {
            title: { _ref: 'nav.performers.visual' },
            description: { en: 'A team of inspired artists to sprinkle magic all around the stomping ground to bring about some truly out-of-this world experience, right there, for you!' }
        },
        tribe: {
            title: { _ref: 'nav.performers.tribe' },
            description: { en: 'None of this would be possible without the dedication of the Altered Tribe who has been hard at work for the past several years to bring together this experience' }
        }
    },
    gallery: {
        title: { _ref: 'nav.gallery' },
        albums: {
            'af2018-alex': {
                title: { en: 'Altered Forest 2018, by Alex' },
                descriptionP1: { en: "If you are Alex who took these pictures and want some proper credit, please write at rom1guyot@protonmail.com and I'll make the appropriate changes" },
                descriptionP2: { en: 'To my defense it\'s Craig\'s fault, he just sent to me a bunch of images titled "Alex\'s Pictures" but I have no idea who Alex is in real life :p' }
            }
        }
    },
    location: {
        title: { _ref: 'nav.location' },
        descriptionP1: { en: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam illo quidem reprehenderit doloremque asperiores ut consequuntur maiores amet vero ipsam exercitationem, consectetur nobis dolores a libero earum incidunt inventore provident.' },
        descriptionP2: { en: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam illo quidem reprehenderit doloremque asperiores ut consequuntur maiores amet vero ipsam exercitationem, consectetur nobis dolores a libero earum incidunt inventore provident.' },
        descriptionP3: { en: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam illo quidem reprehenderit doloremque asperiores ut consequuntur maiores amet vero ipsam exercitationem, consectetur nobis dolores a libero earum incidunt inventore provident.' },
    },
    wip: {
        title: { en: 'Work in Progress', fr: 'Site en Construction' },
        descriptionP1: { en: 'The tribe is hard at work bringing you the best altered forest experience they are able to provide.', fr: 'La tribue travaille d\'arrache-pieds pour vous procurer la meilleure experience Altered Forest qu\'elle peut vous fournir' },
        descriptionP2: { en: 'Come back in a few days to explore the website further and learn more about the wonderful surprises the tribe is brewing!', fr: 'Revenez dans quelques jours pour explorer le site web et en apprendre plus sur les surprises que la tribue a en reserve !'}
    },
    'pound.the.ground': { en: '- Pound the Ground', fr: '- Tape du pied' }
};

const MAX_REF_CHAIN = 10;
