import voteService from '../services/voteService';
import utils from '../utils';
import musicService from "../services/musicService";
import playlistService from "../services/playlistService";

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

function getMyVotesInPlaylist(req, res) {
  if (req.body.playlistId && req.body.userId
    && utils.isValidId(req.body.userId) && utils.isValidId(req.body.playlistId)) {
    voteService.getMyVotesInPlaylist(req.body.userId, req.body.playlistId)
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

function voteMusic(req, res) {
  if (req.body.userId && req.body.musicId && req.body.playlistId && req.body.value
    && utils.isValidId(req.body.musicId) && utils.isValidId(req.body.playlistId)
    && (req.body.value === 1 || req.body.value === -1) && utils.isValidId(req.body.userId)) {
    voteService.voteMusic(req.body.userId, req.body.musicId, req.body.playlistId, req.body.value)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

export default {
  getVoteById,
  getVotes,
  deleteVoteById,
  voteMusic,
  getMyVotesInPlaylist,
};
