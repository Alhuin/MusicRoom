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
    && req.body.authorName
    && req.body.roomType
    && req.body.date !== undefined
    && req.body.dateTwo !== undefined
    && req.body.location !== undefined
    && req.body.privateId !== undefined) {
    playlistService.addPlaylist(req.body.name, req.body.publicFlag,
      req.body.userId, req.body.author, req.body.authorName, req.body.roomType,
      req.body.date, req.body.dateTwo, req.body.location, req.body.privateId)
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
    res.status(422).send({ msg: 'Wrong Parameters' });
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
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

function getBansByPlaylistId(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
    playlistService.getBansByPlaylistId(req.params.playlistId)
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

function adminInPlaylistDowngrade(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.userId && utils.isValidId(req.body.userId)
    && req.body.requesterId && utils.isValidId(req.body.requesterId)) {
    playlistService.adminInPlaylistDowngrade(req.body.playlistId, req.body.userId, req.body.requesterId)
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
    && req.body.userId && utils.isValidId(req.body.userId)
    && req.body.requesterId && utils.isValidId(req.body.requesterId)) {
    playlistService.userInPlaylistUpgrade(req.body.playlistId, req.body.userId, req.body.requesterId)
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

function BanUserInPlaylist(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.userId && utils.isValidId(req.body.userId)
    && req.body.isItAdmin !== undefined
    && req.body.requesterId && utils.isValidId(req.body.requesterId)) {
    playlistService.BanUserInPlaylist(req.body.playlistId, req.body.userId, req.body.isItAdmin, req.body.requesterId)
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

function DeleteUserInPlaylist(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.userId && utils.isValidId(req.body.userId)
    && req.body.isItAdmin !== undefined
    && req.body.requesterId && utils.isValidId(req.body.requesterId)) {
    playlistService.DeleteUserInPlaylist(req.body.playlistId, req.body.userId, req.body.isItAdmin, req.body.requesterId)
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

function addUserToPlaylistAndUnbanned(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.userId && utils.isValidId(req.body.userId)) {
    playlistService.addUserToPlaylistAndUnbanned(req.body.playlistId, req.body.userId)
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

function getNextTrack(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
    playlistService.getNextTrack(req.params.playlistId)
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

function joinPlaylist(req, res) {
  console.log(req.body);
  if (utils.isValidId(req.body.userId) && req.body.playlistCode) {
    playlistService.joinPlaylist(req.body.userId, req.body.playlistCode)
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

function getPlaylistPrivateId(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
    playlistService.getPlaylistPrivateId(req.params.playlistId)
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

function setPublicityOfPlaylist(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.value !== undefined) {
    playlistService.setPublicityOfPlaylist(req.body.playlistId, req.body.value)
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
  getBansByPlaylistId,
  adminInPlaylistDowngrade,
  userInPlaylistUpgrade,
  BanUserInPlaylist,
  DeleteUserInPlaylist,
  getNextTrack,
  addUserToPlaylistAndUnbanned,
  joinPlaylist,
  getPlaylistPrivateId,
  setPublicityOfPlaylist,
};
