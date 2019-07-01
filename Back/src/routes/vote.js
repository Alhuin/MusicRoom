import {Router} from 'express';
import Utils from '../utils'

const router = Router();

router.get('/', (req, res) => {
    res.locals.models.Vote.find({}, (err, votes) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (votes.length) {
            res.status(200).send(Object.values(votes));
        }
        else {
            res.status(400).end();
        }
    });
});

router.get('/:voteId', (req, res) => {
    if (!Utils.isValidId(req.params.voteId)) {
        res.status(400).send("Invalid Id.");
        return;
    }
    res.locals.models.Vote.findById(req.params.voteId, (err, vote) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (vote) {
            res.status(200).send(vote);
        }
        else {
            res.status(400).end();
        }
    });
});

router.delete('/:voteId', (req, res) => {
    if (!Utils.isValidId(req.params.voteId)) {
        res.status(400).send("Invalid Id.");
        return;
    }
    res.locals.models.Vote.findById(req.params.voteId, (err, vote) => {
        if (err) {
            res.status(500).send(err);
            console.error(err);
        }
        else if (vote) {
            res.status(200).send(vote);
        }
        else {
            res.status(400).end();
        }
    });
});

export default router;