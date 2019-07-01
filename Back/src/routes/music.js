import {Router} from 'express';
import Utils from '../utils'

const router = Router();
/**
 *   curl GET "http://localhost:3000/musics
 */
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
    if (!Utils.isValidId(req.params.playlistId)) {
        return res.status(400).send("Invalid Id.");

    }
    res.locals.models.Music.findById(req.params.musicId, (err, music) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        if (music) {
            res.status(200).send(music);
        } else {
            res.status(400).end();
        }
    });
});

router.delete('/:musicId', async (req, res) => {
    if (!Utils.isValidId(req.params.musicId)) {
        return res.status(400).send("Invalid Id.");
    }
    await res.locals.models.Music.findById(req.params.musicId, async (err, music) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        if (music) {
            let result = null;
            result = await music.remove();
            if (result !== null) {
                res.status(200).send(music);
            } else {
                res.status(500).end();
            }
        } else {
            res.status(400).end();
        }
    });

});

export default router;