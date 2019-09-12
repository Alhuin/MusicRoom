import voteService from '../services/voteService';
import utils from '../utils';

function getVotes(req, res) {
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
        .send({ msg: error.msg });
    });
}

function getVoteById(req, res) {
  if ((req.params.voteId && utils.isValidId(req.params.voteId))) {
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
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

function deleteVoteById(req, res) {
  if ((req.params.voteId && utils.isValidId(req.params.voteId))) {
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
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

export default {
  getVoteById,
  getVotes,
  deleteVoteById,
};
