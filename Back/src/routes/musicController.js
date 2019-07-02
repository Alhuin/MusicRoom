import musicService from '../services/musicService'
import utils from '../utils'

const getMusics = function(req, res) {

    musicService.getMusics()
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
};

const getMusicById = function(req, res) {

    if ((req.params.musicId && utils.isValidId(req.params.musicId))){
        musicService.getMusicById(req.params.musicId)
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
};

const deleteMusicById = function(req, res) {

    if ((req.params.musicId && utils.isValidId(req.params.musicId))){
        musicService.deleteMusicById(req.params.musicId)
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
};

export default {
    getMusicById,
    getMusics,
    deleteMusicById,
}