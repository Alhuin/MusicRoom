import {Router} from 'express';
import Utils from '../utils'

const router = Router();

router.get('/', (req, res) => {
    res.locals.models.Music.find({}, (err, musics) => {
        if (err) {
            res.status(500).send(err);
        }
        if (musics.length) {
            res.status(200).send(Object.values(musics))
        } else {
            res.status(400).end();
        }
    });
});

router.get('/:musicId', (req, res) => {
    if (!Utils.isValidId(req.params.musicId)) {
        return res.status(400).send("Invalid Id.");

    }
    res.locals.models.Music.findById(req.params.musicId, (err, music) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (music) {
            res.status(200).send(music);
        } else {
            res.status(400).end();
        }
    });
});

router.delete('/:musicId', (req, res) => {
    if (!Utils.isValidId(req.params.musicId)) {
        return res.status(400).send("Invalid Id.");
    }
    res.locals.models.Music.findById(req.params.musicId, (err, music) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (music) {
            music.remove();
            res.status(200).send(music);
        } else {
            res.status(400).send("Found no music with this id.");
        }
    });

});

export default router;