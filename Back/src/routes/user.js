import {Router} from 'express';
import Utils from '../utils'

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