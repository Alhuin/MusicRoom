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
      // console.error(error);
      res
        .status(error.status)
        .send({ msg: error.msg });
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
        // console.error(error.msg);
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
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
        // console.error(error.msg);
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
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
        // console.error(error.msg);
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

function downloadMusic(req, res) {
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
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send('Wrong Parameters');
  }
}

function addMusicToPlaylist(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId) && req.body.userId
    && utils.isValidId(req.body.userId) && req.body.title && req.body.artist
    && req.body.album && req.body.albumCover && req.body.preview && req.body.link) {
    musicService.addMusicToPlaylist(req.body.playlistId, req.body.userId, req.body.artist,
      req.body.title, req.body.album, req.body.albumCover, req.body.preview, req.body.link)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        // console.error(error);
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

export default {
  getMusicById,
  getMusics,
  getMusicsByVote,
  deleteMusicById,
  downloadMusic,
  addMusicToPlaylist,
};
