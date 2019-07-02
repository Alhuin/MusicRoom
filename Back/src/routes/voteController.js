import voteService from '../services/voteService'

const getVotes = function(req, res) {

    voteService.getVotes()
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

const getVoteById = function(req, res) {

    if ((req.params.voteId && utils.isValidId(req.params.voteId))){
        voteService.getVoteById(req.params.voteId)
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

const deleteVoteById = function(req, res) {

    if ((req.params.voteId && utils.isValidId(req.params.voteId))){
        voteService.deleteVoteById(req.params.voteId)
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
    getVoteById,
    getVotes,
    deleteVoteById,
}