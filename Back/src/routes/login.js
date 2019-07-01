import {Router} from 'express';

const router = Router();

router.post('/',  (req, res) => {
    let login = req.body.login;
    let password = req.body.password;
    res.locals.models.User.find({login}, (err, users) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (users.length) {
            if (users[0].password === password) {
                res.status(200).json(users[0]);
            }
            else {
                res.status(400).json({"error": "Wrong Password"});
            }
        } else {
            res.status(400).json({"error": "Wrong Login"});
        }
    });
});

export default router;