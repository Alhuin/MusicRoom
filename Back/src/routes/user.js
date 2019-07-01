import {Router} from 'express';
import Utils from '../utils'
import models from "../models";

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

    const user = await new models.User({
        login,
        password,
        name,
        familyName,
        email,
    });
    user.save((err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).send(data);
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

export default router;