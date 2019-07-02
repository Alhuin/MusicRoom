import {Router} from 'express';
import Utils from '../utils'

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const router = Router();

router.get('/', (req, res) => {
    res.locals.models.User.find((err, users) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (users.length) {
            res.status(200).send(Object.values(users));
        }
        else {
            res.status(400).end();
        }
    });
});

router.get('/:userId', (req, res) => {
    if (!Utils.isValidId(req.params.userId)) {
        return res.status(400).send("Invalid Id.");
    }
    res.locals.models.User.findById(req.params.userId, (err, user) => {
        // console.log(user);
        if (err) {
            res.status(500).send(err);
        }
        else if (user) {
            res.status(200).send(user);
        }
        else {
            res.status(400).end();
        }
    });
});

router.post('/', async (req, res) => {
    let login = req.body.login;
    let password = req.body.password;
    let name = req.body.name;
    let familyName = req.body.familyName;
    let email = req.body.email;
    let salt = await bcrypt.genSaltSync(10);
    let hash = await bcrypt.hashSync(password, salt);

    const user = await new res.locals.models.User({
        login,
        password: hash,
        name,
        familyName,
        email,
    });

    user.save((err) => {
        if (err) {
            return res.status(500).send({error: err});
        }
        var token = new res.locals.models.Token({
            user: user._id,
            token: crypto.randomBytes(16).toString('hex')
        });

        token.save(function (err) {
            if (err) {
                res.status(500).send({error: err});
            }
        });

        Utils.sendMail(
            res,
            email,
            'Account Verification Token',
            'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users\/confirmation\/' + token.token + '.\n'
        );
    });
});

router.put('/', async (req, res) => {
    res.locals.models.User.findById(res.locals.me._id, async (err, user) => {

        if (err) {
            res.status(500).send(err);
        }
        else if (user) {
            user.set(req.body);
            user.save();
            res.status(200).send(user);
        }
        else {
            res.status(400).end();
        }
    });
});

router.delete('/:userId', (req, res) => {
    if (!Utils.isValidId(req.params.userId)) {
        return res.status(400).send("Invalid Id.");

    }
    res.locals.models.User.findById(req.params.userId, async (err, user) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (user) {
            let result = await user.remove();
            res.status(200).send(result);
        }
        else {
            res.status(400).end();
        }
    });
});


router.get('/confirmation/:token', (req, res) => {
    res.locals.models.Token.findOne({token: req.params.token}, function (err, token) {
        if (!token) return res.status(400).send({
            error: 'We were unable to find a valid token. Your token may have expired.'
        });

        res.locals.models.User.findOne({_id: token.user}, function (err, user) {
            if (!user) {
                return res.status(400).send({error: 'We were unable to find a user for this token.'});
            }
            if (user.isVerified) {
                return res.status(400).send({
                    error: 'This user has already been verified.'
                });
            }

            user.isVerified = true;
            user.save(function (err) {
                if (err) {
                    return res.status(500).send({err: err});
                }
                res.status(200).send("The account has been verified. You can now log in.");
            });
        });
    });
});



router.post('/resend', (req, res) => {

        res.locals.models.User.findOne({ email: req.body.email }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
            if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

            // Create a verification token, save it, and send email
            var token = new res.locals.models.Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

            // Save the token
            token.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }

                // Send the email
                var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
                var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
                transporter.sendMail(mailOptions, function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    res.status(200).send('A verification email has been sent to ' + user.email + '.');
                });
            });

        });
});

export default router;