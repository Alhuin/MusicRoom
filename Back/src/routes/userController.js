import userService from '../services/userService'
import utils from '../utils'

function getUsers(req, res) {

    userService.getUsers()
        .then((response) => {
            res
                .status(response.status)
                .send(response.data);
        })
        .catch((error) => {
            console.error(error.msg);
            res
                .status(error.status)
                .send(error.msg);
        })
}

function getUserById(req, res) {

    if ((req.params.userId && utils.isValidId(req.params.userId))){
        userService.getUserById(req.params.userId)
            .then((response) => {
                res
                    .status(response.status)
                    .send(response.data);
            })
            .catch((error) => {
                console.error(error.msg);
                res
                    .status(error.status)
                    .send(error.msg);
            })
    }
    else {
        res.status(400).send({msg: "Wrong Parameters"});
    }
}

function deleteUserById(req, res) {

    if ((req.params.userId && utils.isValidId(req.params.userId))){
        userService.deleteUserById(req.params.userId)
            .then((response) => {
                res
                    .status(response.status)
                    .send(response.data);
            })
            .catch((error) => {
                console.error(error.msg);
                res
                    .status(error.status)
                    .send(error.msg);
            })
    }
    else {
        res.status(400).send({msg: "Wrong Parameters"});
    }
}

function addUser(req, res) {

    // checker email valide et les uniques

    if ((req.body.login && req.body.password && req.body.name &&
        req.body.familyName && req.body.email)){
        userService.addUser(req.body.login, req.body.password, req.body.name, req.body.familyName, req.body.email)
            .then((response) => {
                res
                    .status(response.status)
                    .send(response.data);
            })
            .catch((error) => {
                console.error(error.msg);
                res
                    .status(500)
                    .send(error.msg);
            })
    }
    else {
        res.status(400).send({msg: "Wrong Parameters"});
    }
}

function confirmEmail(req, res) {

    if (req.params.token) {
        userService.confirmEmail(req.params.token)
            .then((response) => {
                res
                    .status(response.status)
                    .send(response.data);
            })
            .catch((error) => {
                res
                    .status(error.status)
                    .send(error.msg);
            })
    }
    else {
        res.status(400).send({msg: "Wrong Parameters"});
    }
}

export default {
    getUserById,
    getUsers,
    deleteUserById,
    addUser,
    confirmEmail,
}

// router.post('/resend', (req, res) => {
//
//         res.locals.models.User.findOne({ email: req.body.email }, function (err, user) {
//             if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
//             if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });
//
//             // Create a verification token, save it, and send email
//             var token = new res.locals.models.Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
//
//             // Save the token
//             token.save(function (err) {
//                 if (err) { return res.status(500).send({ msg: err.message }); }
//
//                 // Send the email
//                 var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
//                 var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification TokenModel', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
//                 transporter.sendMail(mailOptions, function (err) {
//                     if (err) { return res.status(500).send({ msg: err.message }); }
//                     res.status(200).send('A verification email has been sent to ' + user.email + '.');
//                 });
//             });
//
//         });
// });