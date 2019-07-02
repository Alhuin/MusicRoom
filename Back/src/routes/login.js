import {Router} from 'express';
const bcrypt = require('bcrypt');
const router = Router();

router.post('/',  (req, res) => {
    let login = req.body.login;
    let password = req.body.password;
    res.locals.models.User.find({login}, (err, users) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (users.length) {
            if (bcrypt.compareSync(password, users[0].password)) {
                if (!(users[0].isVerified)){
                    return res.status(400).send({"error": "User not verified"});
                }
                res.status(200).send(users[0]);
            }
            else {
                res.status(400).send({"error": "Invalid Password"});
            }
        } else {
            res.status(400).send({"error": "Invalid Login"});
        }
    });
});

export default router;