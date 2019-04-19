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
            applications: { en: 'Applications', fr: 'Candidatures' },
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
        description: {
            en: 'Get to know the team working together to alter y\'all!!', fr: 'Apprenez a connaitre l\'equipe chargee de vous alterer le week-end !'        },
        audio: {
            title: { _ref: 'nav.performers.audio' },
            description: {
                en: 'A team of dedicated musicians and sound wizards who brewed their best tracks to tickle both your ears and your brain!',
                fr: "Une équipe de musiciens et d'assistants sonores dévoués qui ont préparé leurs meilleurs morceaux pour chatouiller à la fois tes oreilles et ton cerveau!"
            }
        },
        visual: {
            title: { _ref: 'nav.performers.visual' },
            description: {
                en: 'A team of inspired artists to sprinkle magic all around the stomping ground to bring about some truly out-of-this world experience, right there, for you!',
                fr: "Une équipe d'artistes inspirés pour répandre de la magie sur tout le terrain pour créer une expérience véritablement hors du commun, pour toi!"
            }
        },
        tribe: {
            title: { _ref: 'nav.performers.tribe' },
            description: {
                en: 'None of this would be possible without the dedication of the Altered Tribe who has been hard at work for the past several years to bring together this experience.',
                fr: 'Rien de tout cela ne serait possible sans le dévouement de la tribu Altered qui travaille depuis plusieurs années pour rassembler cette expérience.'
            }
        }
    },
    gallery: {
        title: { _ref: 'nav.gallery' },
        albums: {
            'af2018': {
                title: {
                    en: 'Altered Forest 2018',
                    fr: 'Altered Forest 2018'
                },
                descriptionP1: {
                    en: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam cumque aspernatur nemo natus itaque earum nam perspiciatis vel deleniti, vitae illum rem. Odio earum incidunt cupiditate quae laborum ipsam veniam! lorem",
                    fr: ''
                },
                descriptionP2: {
                    en: 'Doloremque distinctio ipsam quibusdam ratione beatae sit consequatur voluptas repellat, voluptate quas quidem consequuntur, minima at modi. Minima natus nulla quas doloribus.',
                    fr: ''
                }
            }
        }
    },
    location: {
        title: { _ref: 'nav.location' },
        descriptionP1: { en: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam illo quidem reprehenderit doloremque asperiores ut consequuntur maiores amet vero ipsam exercitationem, consectetur nobis dolores a libero earum incidunt inventore provident.' },
        descriptionP2: { en: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam illo quidem reprehenderit doloremque asperiores ut consequuntur maiores amet vero ipsam exercitationem, consectetur nobis dolores a libero earum incidunt inventore provident.' },
        descriptionP3: { en: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam illo quidem reprehenderit doloremque asperiores ut consequuntur maiores amet vero ipsam exercitationem, consectetur nobis dolores a libero earum incidunt inventore provident.' },
    },
    info: {
        title: { _ref: 'nav.info.title' },
        tips: {
            wellness: {
                title: { en: 'SAFETY & WELLNESS', fr: 'SÉCURITÉ ET BIEN-ÊTRE'},
                positivity: {
                    title: { en: 'Inclusivity & Positivity', fr: 'Inclusivité et positivité' },
                    paragraph: {
                        en: 'The Altered Forest is a happy place that welcomes everyone. We have zero tolerance for Sexism, Racism, Homophobia, Transphobia, Harassment, Ableism, or General Hatefulness of any kind. People come to have festivals to have fun, not to be made to feel unsafe or marginalized. So don’t be a jerk, or else you’ll be asked to leave.',
                        fr: "L'Altered Forest est un endroit joyeux qui accueille tout le monde. Nous n'avons aucune tolérance pour le sexisme, le racisme, l'homophobie, la transphobie, le harcèlement, le capacitisme ou tout autre forme de haine. Les gens viennent dans les festivals pour s'amuser, pas pour se sentir mal à l'aise ou marginalisés. Ne soit donc pas desagreable sinon on te demandera de partir."
                    }
                },
                safeSpace: {
                    title: { en: 'Safe Space', fr: 'Espace sécurisé' },
                    paragraph1: {
                        en: 'The Psytribe is a safe community, and we want to keep it that way! Each Altered Forest team member will be easily identifiable & available to help you in the event that you feel unsafe. We will be there to listen, to offer a safe physical space, or to simply hang out with you for a while.',
                        fr: "La Psytribe est une communauté sûre et nous voulons que cela reste ainsi! Chaque membre de l'équipe de l'Altered Forest sera facilement identifiable et disponible pour vous aider en cas de danger. Nous serons là pour t'écouter, pour t'offrir un espace physique sécurisé ou simplement pour passer du temps avec toi."
                    },
                    strong: { en: 'MAKE NO MISTAKE: ', fr: 'QUE CECI SOIT CLAIR: ' },
                    paragraph2: {
                        en: 'Predatory behaviour of any kind will not be tolerated. Gross people will be asked to leave or will be physically removed if necessary.',
                        fr: 'Aucun comportement prédateur ne sera toléré. Les personnes toxiques seront invitées à partir ou seront physiquement virés du site si nécessaire.'
                    }
                },
                firstAid: {
                    title: { en: 'First Aid / Naloxone', fr: 'Premiers secours / naloxone' },
                    paragraph1: {
                        en: 'Altered Forest staff are trained in First Aid as well as Naloxone. We will have both medical aid kits on site at the event to ensure we have the safest, most amazing time possible! We’re ready for all your nicks and bruises, just in case something more serious happens, civilization is not far away!',
                        fr: "Le personnel de Altered Forest est formé aux premiers secours et à l'utilisation de naloxone. Nous aurons les deux kits d’aide médicale sur place lors de l’événement pour nous assurer que nous passerons un moment le plus sûr et le plus incroyable possible! Nous sommes prêts a intervenir en cas de n'importe quelle blessure et au cas où quelque chose de plus grave se produirait, la civilisation n’est pas très loin!"
                    },
                    paragraph2: {
                        en: 'Help us further improve the wellness of the event by Educating yourself about the Dangers of Fentanyl. Stop Overdose Ottawa is a great resource to learn just how prevalent and deadly Fentanyl is. Before joining us for the festival, why not give this website on overdose prevention a read? If all of us are educated about the warning signs, the safer we’ll all be.',
                        fr: "Aide-nous à améliorer le bien-être de l'événement en te renseignant sur les dangers du fentanyl. Arrêt Overdose Ottawa est une excellente ressource pour apprendre à quel point le Fentanyl est répandu et mortel. Avant de nous rejoindre pour le festival, pourquoi ne pas consulter ce site sur la prévention des surdoses? Si nous sommes tous informés des signaux d’alerte, nous serons mieux en sécurité."
                    },
                    link: {
                        en: 'Stop Overdose Ottawa',
                        fr: 'Arrêt Overdose Ottawa'
                    }
                }
            },
            safety: {
                title: { en: 'General Safety', fr: 'Sécurité générale' },
                paragraph1: {
                    en: 'Earplugs = Ear Peace! Things will get loud! Make sure to give your ears the love they deserve.',
                    fr: "Bouchons d'Oreilles = Oreilles en Paix! Les choses vont etres bruyantes! Assure-toi de donner à tes oreilles l'amour qu'elles méritent."
                },
                paragraph2: {
                    en: 'Watch your feet in the Woods! Don’t let a stubbed toe or cut ankle get in the way of your dancing! Careful where you step and wear footwear when possible!',
                    fr: "Surveille tes pieds dans les bois! Ne laisse pas un orteil écrasé ou une coupure a la cheville gêner ta danse! Fais attention lorsque tu marches et portes des chaussures lorsque c'est possible!"
                },
                paragraph3: {
                    en: 'Be Careful When Swimming! Taking a dip is encouraged, but make sure to do so safely! Don’t swim alone, and if you feel a little tipsy, maybe stick to the shallow end, yeah?',
                    fr: 'Soit prudent lorsque tu nages! Prendre un bain est encouragé, mais assure-toi de le faire en toute sécurité! Ne nage pas seul, et si tu te sens un peu éméché, reste dans la partie peu profonde, ok?'
                },
                paragraph4: {
                    en: 'Ticks are in Season! We’re out in the woods after all! Make sure to watch for ticks, and wear protection when you can!',
                    fr: "C'est la saison des tiques! Nous sommes dans les bois après tout! Assure-toi de surveiller les tiques et porte une protection lorsque tu le peux!"
                },
                paragraph5: {
                    en: 'The Sun will Burn! And it takes no prisoners! Protect your skin with sunscreen!',
                    fr: "Le soleil va brûler! Et cela n'epargne personne! Protége ta peau avec un écran solaire!"
                },
                paragraph6: {
                    en: 'Drink Lots of Water! It’s Summer, silly! Make sure to stay hydrated to regulate your temperature and keep your dance feet movin!',
                    fr: "Bois beaucoup d'eau! C'est l'été, n'oublie pas! Assure-toi de rester hydraté pour réguler ta température et garder la dance dans les pieds!"
                }
            }
        },
        applications: {
            title: { _ref: 'nav.info.applications' },
            music: {
                title: { en: 'Musical Performer Application', fr: 'Inscriptions des Musiciens' },
                description: {
                    en: 'Thank you for your interest in performing at Altered Forest 2019 on August 16-18 in the beautiful hills of Quebec, Canada!! We will consider each application and select those which make sense for the festival based on many factors. As we are still growing, we have decided to do one stage this year meaning there are limited spaces available. Please fill out these questions thoughtfully and thoroughly :)',
                    fr: "Merci pour ton interet a jouer a Altered Forest 2019 du 16 au 18 Aout 2018, dans les magnifiques collines de Quebec, Canada!! Nous allons considerer chaque candidature et selectionner ceux qui auront le plus de sens pour le festival base sur de nombreux facteurs. Comme nous sommes toujours en phase de croissance, nous avons decide de ne proposer qu'une scene cette annee ce qui signifie que les places seront limitees. Merci de repondre aux questions attentivement !"
                },
            },
            workshop: {
                title: { en: 'Workshop / Performance Art' },
                description: { en: 'Application to Share your Gifts with Others', fr: 'Candidature pour partager vos creations' }
            },
            vendor: {
                title: { en: 'Vendor', fr: 'Vendeur' },
                descriptionP1: {
                    en: 'Our tribe is a collective of amazing minds driving at a common goal. Super kick ass psychedelic underground events that have you humming for weeks afterwards. That feeling and such dope events are only achieved by gathering an amazing tribe. Our vision is to have a diverse market area this year at our festival. Don\'t delay, as vendor slots are limited.Our fee this year is everyone person working a booth of their own or assisting must buy a ticket, so get em\' while they are cheap! :)',
                    fr: 'Notre tribue est un collectif d\'esprit geniaux partageant le meme but. Des evenements psychedeliques underground qui te laisseront fredonner pour plusieurs semaines. Ce sentiment a ces evenements fous sont possible uniquement grace au rassemblement des efforts de notre tribue. Notre vision est d\'avoid un marche particulierement diversifie cette annee. n\'attends pas, les places sont limitees. Les frais cette annees sont simplement que chaque personne travaillant a un stand doivent acheter un billet, donc profitez-en vite !'
                },
                descriptionP2: {
                    en: 'We are looking for: Food, apparel, trinkets, mysteries, healing and more! Please fill out the information below by clicking here and we\'ll respond swiftly! Electricity is available, please inquire.',
                    fr: 'Nous rechercons: nourriture, vetements, bijoux, surprises, soins, et plus ! Rensseigne les informations en cliquant ici et nous te repondrons au plus vite ! L\'electricite est disponible sur demande.'
                }
            },
            tribe: {
                title: { en: 'Tribe Member', fr: 'Membre de la Tribue' },
                description: {
                    en: 'Altered Forest is a collective of amazing minds dedicated to throwing kick-ass underground psychedelic parties. There is an immense amount of hard work involved in throwing a quality event. We need you: a hard-working party freak. We need you: a solutions-finding dreamer. If you accept this challenge, we can guarantee good times, good people, and the chance to give back to your community! :)',
                    fr: 'Altered Forest est un collectif d\'esprit geniaux concentres sur l\'organisation de soirees psychedeliques underground. Il y a une immense quantite de travail necessaire a l\'organisation d\'un evenement de qualite. Nous avons besoin de toi: un party freak qui aime se donner a fond. Un reveur de solutions. Si tu te sens pret a afronter le defi, nous pouvons te garantir des bons moments, des personnes passionantes, et la chance de donner un coup de main a la communaute ! :)'
                }
            },
        },
        contact: {
            title: { _ref: 'nav.info.contact' },
            descriptionP1: { en: 'To contact us, shoot us an email at ', fr: 'Pour nous contacter, envoie un email a l\'adresse ' },
            descriptionP2: {
                en: ', or use the form below to send us a message directly, we\'ll reply to you over the email you indicate.',
                fr: ', ou utilise le formulaire ci-dessous pour nous ecrire directement, nous te repondrons a l\'adresse que tu indiqueras.'
            },
            descriptionP3: {
                en: 'Do not use this form for volunteer, artist or vendor applications, we have a dedicated page for this purpose. Please visit the',
                fr: 'N\'utilise pas ce formulaire pour les inscriptions volontariat, artiste our vendeur, nous avons une page dediee a ce sujet. Va visiter la'
            },
            descriptionP4: { en: ' Application Page ',  fr: ' Page de Candidature '},
            descriptionP5: { en: 'for more information and submit your application!', fr: 'pour plus d\'information et envoyer ton inscription !' },
            helpText: {
                en: 'Note: all fields (marked with a *) are required. Double check your sender email address as we\;ll use this to reply back to you!',
                fr: 'Note que tous les champs (marques d\'une *) sont requis. Pense a reverifier ton adresse email, c\'est sur cette adresse que nous allons te repondre !' },
            sender: { en: 'Sender Email Address', fr: 'Adresse email de l\'envoyeur' },
            subject: { en: 'Subject', fr: 'Sujet' },
            body: { en: 'Message', fr: 'Message' },
            submit: { en: 'Send', fr: 'Envoyer' },
            success: {
                en: 'Message send successfully! Thanks for your contact, We\'ll try to reply as quickly as possible.',
                fr: 'Message envoye avec succes ! Merci pour ta prise de contact, nous essaierons de te repondre au plus vite.'
            },
            error: {
                en: 'Oh snap! Looks like something went wrong. Maybe try and send us an email directly?',
                fr: 'Oh non ! Il semblre qu\'une erreur se soit produite lors de l\'envoie de l\'email. Reessaie, ou contacte-nous par email directement.'
            }
        },
        camping: {
            description: {
                en: 'We’ve all been to events and have seen the mess that can be left post-party. The natural beauty of The Altered Forest shall not be sullied by slobbery! So we’re enlisting your help to make sure it doesn’t happen. Of course we’ll arm you with the tools to make it easy. Everyone gets a black and a clear garbage bag, the black one for refuse and the clear one for recycling.',
                fr: 'Nous sommes tous allés à des événements et avons vu le désordre qui peut rester après la fête. La beauté naturelle de l\'Altered Forest ne doit pas être souillée par des bavures! Nous sollicitons donc ton aide pour faire en sorte que cela ne se produise pas. Bien entendu, nous te fournirons les outils nécessaires pour te faciliter la tâche. Tout le monde reçoit un sac à ordures noir et clair, le sac noir pour les ordures et le sac clair pour le recyclage.'
            },
            washroom: {
                title: {
                    en: 'Washrooms are shared by Everyone!',
                    fr: 'Les toilettes sont partagées par tous!'
                },
                description: {
                    en: 'The Toilets will be cleaned throughout the festival, but let’s all do our part to make sure they’re as nice to use as possible!',
                    fr: 'Les toilettes seront nettoyées tout au long du festival, mais faisons tous notre part pour qu’elles soient aussi agréables que possible!'
                }
            },
            waste: {
                title: {
                    en: 'Bring in, Bring Out!',
                    fr: 'Ce qui rentre, ressort!'
                },
                description: {
                    en: 'Brought something with you? Take it when you leave! We’re close by a provincial park, so let’s abide by the same rules and leave no trace.',
                    fr: "Tu as Apporté quelque chose avec toi ? Prends-le quand tu t'en vas! Nous sommes proches d’un parc provincial, alors respectons les mêmes règles et ne laissons aucune trace."
                }
            },
            garbage: {
                title: {
                    en: 'Garbage Cans Abound!',
                    fr: 'Les poubelles abondent!'
                },
                description: {
                    en: 'Refuse and recycling receptacles will be placed all over the festival grounds, so do your part by keeping clean! Help us out even further by tossing out any trash you come across during the party!',
                    fr: 'Des poubelles et des bacs de recyclage seront placés sur tout le terrain du festival, alors fais ta part en restant propre! Aide-nous encore plus en jetant toutes les ordures que tu rencontreras pendant la fête!'
                }
            },
            butts: {
                title: {
                    en: 'Butt Cans Abound Too!',
                    fr: 'Les cendriers abondent aussi!'
                },
                description: {
                    en: 'We hate dirty butts and we can not lie! Those over ravers can’t deny, let’s ensure they aren’t littering the Altered Forest floor yo! Butt/Roach cans will be all over the festival grounds and clearly marked for easy use!',
                    fr: 'Nous détestons les mégots sales et nous ne pouvons pas mentir! Les ravers ne peuvent pas nier, assurons-nous qu’ils ne jetteront pas un voile sur le sol de la forêt altérée, yo! Les cannettes Butt / Roach seront partout sur le terrain du festival et clairement identifiées pour une utilisation facile!'
                }
            }

        }
    },
    wip: {
        title: { en: 'Work in Progress', fr: 'Site en Construction' },
        descriptionP1: { en: 'The tribe is hard at work bringing you the best altered forest experience they are able to provide.', fr: 'La tribue travaille d\'arrache-pieds pour vous procurer la meilleure experience Altered Forest qu\'elle peut vous fournir' },
        descriptionP2: { en: 'Come back in a few days to explore the website further and learn more about the wonderful surprises the tribe is brewing!', fr: 'Revenez dans quelques jours pour explorer le site web et en apprendre plus sur les surprises que la tribue a en reserve !'}
    },
    'pound.the.ground': { en: '- Pound the Ground', fr: '- Tape du pied' }
};

const MAX_REF_CHAIN = 10;
