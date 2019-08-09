import musicService from '../services/musicService';
import utils from '../utils';

function getMusics(req, res) {
  musicService.getMusics()
    .then((response) => {
      res
        .status(response.status)
        .send(response.data);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(error.status)
        .send(error.msg);
    });
}

function getMusicById(req, res) {
  if ((req.params.musicId && utils.isValidId(req.params.musicId))) {
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
      });
  } else {
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

function getMusicsByVote(req, res) {
  if ((req.params.playlistId && utils.isValidId(req.params.playlistId))) {
    musicService.getMusicsByVote(req.params.playlistId)
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
      });
  } else {
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

function deleteMusicById(req, res) {
  if (req.params.musicId && utils.isValidId(req.params.musicId)) {
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
      });
  } else {
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

function voteMusic(req, res) {
  if (req.body.musicId && req.body.playlistId && req.body.value
    && utils.isValidId(req.body.musicId) && utils.isValidId(req.body.playlistId)
    && (req.body.value === 1 || req.body.value === -1)) {
    musicService.voteMusic(req.body.musicId, req.body.playlistId, req.body.value)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        res
          .status(error.status)
          .send(error.msg);
      });
  } else {
    res.status(400).send('Wrong Parameters');
  }
}

function downloadMusic(req, res) {
  console.log(req.body.musicUrl);
  if (req.body.musicUrl && req.body.musicUrl !== '') {
    musicService.downloadMusic(req.body.musicUrl)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        res
          .status(error.status)
          .send(error.msg);
      });
  } else {
    res.status(400).send('Wrong Parameters');
  }
}

export default {
  getMusicById,
  getMusics,
  getMusicsByVote,
  deleteMusicById,
  voteMusic,
  downloadMusic,
};
