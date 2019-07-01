import {Router} from 'express';
import Utils from "../utils";

const router = Router();

router.get('/', (req, res) => {
    res.locals.models.Playlist.find({}, (err, playlists) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (playlists.length) {
            res.status(200).send(Object.values(playlists))
        } else {
            res.status(400).end();
        }
    });
});

router.get('/:playlistId', (req, res) => {
    if (!Utils.isValidId(req.params.playlistId)) {
        return res.status(400).send("Invalid Id.");

    }
    res.locals.models.Playlist.findById(req.params.playlistId, (err, playlist) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (playlist) {
            res.status(200).send(playlist);
        } else {
            res.status(400).end();
        }
    });
});

router.delete('/:playlistId', (req, res) => {
    if (!Utils.isValidId(req.params.playlistId)) {
        return res.status(400).send("Invalid Id.");

    }
    res.locals.models.Playlist.findById(req.params.playlistId, async (err, playlist) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (playlist) {
            let result = null;
            result = await playlist.remove();
            if (result !== null) {
                res.status(200).end();
            } else {
                res.status(500).end();
            }
        } else {
            res.status(400).end();
        }
    });
});

export default router;