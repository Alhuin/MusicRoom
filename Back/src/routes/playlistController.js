import playlistService from '../services/playlistService'
import utils from '../utils'

const getPlaylists = function(req, res) {

    playlistService.getPlaylists()
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

const getPlaylistById = function(req, res) {

    if ((req.params.playlistId && utils.isValidId(req.params.playlistId))){
        playlistService.getPlaylistById(req.params.playlistId)
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

const deletePlaylistById = function(req, res) {

    if ((req.params.playlistId && utils.isValidId(req.params.playlistId))){
        playlistService.deletePlaylistById(req.params.playlistId)
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
    getPlaylistById,
    getPlaylists,
    deletePlaylistById,
}