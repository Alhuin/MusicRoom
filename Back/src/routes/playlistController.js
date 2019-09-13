import playlistService from '../services/playlistService';
import utils from '../utils';

function getPlaylists(req, res) {
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
        .send({ msg: error.msg });
    });
}

function getPlaylistById(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
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
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

function getPublicityOfPlaylistById(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
    playlistService.getPublicityOfPlaylistById(req.params.playlistId)
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

function getPlaylistsFilteredByRoom(req, res) {
  if (req.params.roomType) {
    playlistService.getPlaylistsFilteredByRoom(req.params.roomType)
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

function getPlaylistsFiltered(req, res) {
  if (req.body.roomType && req.body.userId && utils.isValidId(req.body.userId)) {
    playlistService.getPlaylistsFiltered(req.body.roomType, req.body.userId)
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

function addPlaylist(req, res) {
  if (req.body.name && req.body.publicFlag !== undefined
    && utils.isValidId(req.body.userId)
    && utils.isValidId(req.body.author)
    && req.body.roomType) {
    playlistService.addPlaylist(req.body.name, req.body.publicFlag,
      req.body.userId, req.body.author, req.body.roomType)
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

function deletePlaylistById(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
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
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

function isAdmin(req, res) {
  if (req.body.userId
    && utils.isValidId(req.body.userId)
    && req.body.playlistId
    && utils.isValidId(req.body.playlistId)) {
    playlistService.isAdmin(req.body.userId, req.body.playlistId)
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
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

function getAdminsByPlaylistId(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
    playlistService.getAdminsByPlaylistId(req.params.playlistId)
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

function getUsersByPlaylistId(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
    playlistService.getUsersByPlaylistId(req.params.playlistId)
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
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

function adminInPlaylistDowngrade(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.userId && utils.isValidId(req.body.userId)) {
    playlistService.adminInPlaylistDowngrade(req.body.playlistId, req.body.userId)
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
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

function userInPlaylistUpgrade(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.userId && utils.isValidId(req.body.userId)) {
    playlistService.userInPlaylistUpgrade(req.body.playlistId, req.body.userId)
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
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

function userInPlaylistKick(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.userId && utils.isValidId(req.body.userId)
  && req.body.isItAdmin !== undefined) {
    playlistService.userInPlaylistKick(req.body.playlistId, req.body.userId, req.body.isItAdmin)
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
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

export default {
  getPlaylistById,
  getPlaylists,
  getPlaylistsFilteredByRoom,
  getPlaylistsFiltered,
  getPublicityOfPlaylistById,
  addPlaylist,
  deletePlaylistById,
  isAdmin,
  getAdminsByPlaylistId,
  getUsersByPlaylistId,
  adminInPlaylistDowngrade,
  userInPlaylistUpgrade,
  userInPlaylistKick,
};
