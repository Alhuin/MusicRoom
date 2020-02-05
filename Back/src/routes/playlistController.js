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

function getPlaylistName(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
    playlistService.getPlaylistName(req.params.playlistId)
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
    && req.body.userId && req.body.author && req.body.delegatedPlayerAdmin
    && utils.isValidId(req.body.userId)
    && utils.isValidId(req.body.author)
    && utils.isValidId(req.body.delegatedPlayerAdmin)
    && req.body.authorName
    && req.body.roomType
    && req.body.startDate !== undefined
    && req.body.endDate !== undefined
    && req.body.location
    && req.body.privateId !== undefined) {
    playlistService.addPlaylist(req.body.name, req.body.publicFlag,
      req.body.userId, req.body.author, req.body.authorName,
      req.body.delegatedPlayerAdmin, req.body.roomType,
      req.body.startDate, req.body.endDate, req.body.location, req.body.privateId)
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
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)) {
    playlistService.deletePlaylistById(req.body.playlistId, req.body.userId)
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

function deletePlaylistByAdmin(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.userId && utils.isValidId(req.body.userId)) {
    playlistService.deletePlaylistByAdmin(req.body.playlistId, req.body.userId)
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
    playlistService.adminInPlaylistDowngrade(req.body.playlistId, req.body.userId,
      req.body.requesterId)
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
    playlistService.userInPlaylistUpgrade(req.body.playlistId, req.body.userId,
      req.body.requesterId)
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

function banUserInPlaylist(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.userId && utils.isValidId(req.body.userId)
    && req.body.isItAdmin !== undefined
    && req.body.requesterId && utils.isValidId(req.body.requesterId)) {
    playlistService.banUserInPlaylist(
      req.body.playlistId, req.body.userId,
      req.body.isItAdmin, req.body.requesterId,
    )
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

function deleteUserInPlaylist(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.userId && utils.isValidId(req.body.userId)
    && req.body.isItAdmin !== undefined
    && req.body.requesterId && utils.isValidId(req.body.requesterId)) {
    playlistService.deleteUserInPlaylist(req.body.playlistId, req.body.userId,
      req.body.isItAdmin, req.body.requesterId)
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

function getNextTrackByVote(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
    playlistService.getNextTrackByVote(req.params.playlistId)
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

function joinPlaylistWithCode(req, res) {
  // console.log(req);
  if (utils.isValidId(req.body.userId) && req.body.playlistCode) {
    playlistService.joinPlaylistWithCode(req.body.userId, req.body.playlistCode)
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

function joinPlaylistWithId(req, res) {
  if (utils.isValidId(req.body.userId) && req.body.playlistId) {
    playlistService.joinPlaylistWithId(req.body.userId, req.body.playlistId)
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

function getDelegatedPlayerAdmin(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
    playlistService.getDelegatedPlayerAdmin(req.params.playlistId)
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

function setDelegatedPlayerAdmin(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.userId && utils.isValidId(req.body.userId)
    && req.body.requesterId && utils.isValidId(req.body.requesterId)) {
    playlistService.setDelegatedPlayerAdmin(req.body.playlistId, req.body.userId,
      req.body.requesterId)
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

function deleteTrackFromPlaylist(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
  && req.body.musicId && utils.isValidId(req.body.musicId)) {
    playlistService.deleteTrackFromPlaylist(req.body.playlistId, req.body.musicId)
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

function deleteTrackFromPlaylistRight(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
  && req.body.musicId && utils.isValidId(req.body.musicId)
  && req.body.userId && utils.isValidId(req.body.userId)) {
    playlistService.deleteTrackFromPlaylistRight(
      req.body.playlistId, req.body.musicId, req.body.userId,
    )
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

function moveTrackOrder(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
  && req.body.musicId && utils.isValidId(req.body.musicId)
  && req.body.newIndex !== undefined) {
    playlistService.moveTrackOrder(req.body.playlistId, req.body.musicId, req.body.newIndex)
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

function getPlaylistDates(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
    playlistService.getPlaylistDates(req.params.playlistId)
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

function getPlaylistLocation(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
    playlistService.getPlaylistLocation(req.params.playlistId)
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

function getTags(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
    playlistService.getTags(req.params.playlistId)
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

function setTags(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.newTags) {
    playlistService.setTags(req.body.playlistId, req.body.newTags)
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

function setPlaylistLocation(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.userId && utils.isValidId(req.body.userId)
    && req.body.newLocation && Object.keys(req.body.newLocation).length !== 0) {
    playlistService.setPlaylistLocation(req.body.playlistId, req.body.newLocation, req.body.userId)
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

function setStartDate(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId) && req.body.newDate) {
    playlistService.setStartDate(req.body.playlistId, req.body.newDate)
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

function setEndDate(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId) && req.body.newDate) {
    playlistService.setEndDate(req.body.playlistId, req.body.newDate)
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

function getEditRestriction(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
    playlistService.getEditRestriction(req.params.playlistId)
      .then((response) => {
        res
          .status(response.status)
          .send([response.data]);
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

function setEditRestriction(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.newEditRestriction !== undefined) {
    playlistService.setEditRestriction(req.body.playlistId, req.body.newEditRestriction)
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

function isEditor(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.userId && utils.isValidId(req.body.userId) && req.body.pos !== undefined) {
    playlistService.isEditor(req.body.playlistId, req.body.userId, req.body.pos)
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

function setPlaylistName(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && req.body.userId && utils.isValidId(req.body.userId) && req.body.newName) {
    playlistService.setPlaylistName(req.body.playlistId, req.body.userId, req.body.newName)
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

function getNextRadioTrack(req, res) {
  console.log(req.body);
  console.log('playlistId', req.body.playlistId && utils.isValidId(req.body.playlistId));
  console.log('currentTrackId', req.body.currentTrackId === null || utils.isValidId(req.body.currentTrackId));
  console.log('nextIndex', parseInt(req.body.nextIndex, 10));
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && (req.body.currentTrackId === null || utils.isValidId(req.body.currentTrackId))
    && Number.isInteger(parseInt(req.body.nextIndex, 10))) {
    playlistService.getNextRadioTrack(
      req.body.playlistId,
      req.body.currentTrackId,
      req.body.nextIndex,
    )
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

function getPrevRadioTrack(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
    && (utils.isValidId(req.body.currentTrackId) || req.body.currentTrackId === null)
    && Number.isInteger(req.body.prevIndex)) {
    playlistService.getPrevRadioTrack(
      req.body.playlistId,
      req.body.currentTrackId,
      req.body.prevIndex,
    )
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

function setNowPlaying(req, res) {
  if (req.body.playlistId && utils.isValidId(req.body.playlistId)
      && (utils.isValidId(req.body.trackId) || req.body.trackId === null)) {
    playlistService.setNowPlaying(
      req.body.playlistId,
      req.body.trackId,
    )
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

function getNowPlaying(req, res) {
  if (req.params.playlistId && utils.isValidId(req.params.playlistId)) {
    playlistService.getNowPlaying(req.params.playlistId)
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
  setNowPlaying,
  getNowPlaying,
  getPlaylistById,
  getPlaylists,
  getPlaylistsFilteredByRoom,
  getPlaylistsFiltered,
  getPublicityOfPlaylistById,
  addPlaylist,
  deletePlaylistById,
  deletePlaylistByAdmin,
  isAdmin,
  getAdminsByPlaylistId,
  getUsersByPlaylistId,
  getBansByPlaylistId,
  adminInPlaylistDowngrade,
  userInPlaylistUpgrade,
  banUserInPlaylist,
  deleteUserInPlaylist,
  getNextTrackByVote,
  getNextRadioTrack,
  getPrevRadioTrack,
  addUserToPlaylistAndUnbanned,
  joinPlaylistWithCode,
  joinPlaylistWithId,
  getPlaylistPrivateId,
  getDelegatedPlayerAdmin,
  setPublicityOfPlaylist,
  setDelegatedPlayerAdmin,
  deleteTrackFromPlaylist,
  deleteTrackFromPlaylistRight,
  moveTrackOrder,
  getPlaylistDates,
  setStartDate,
  setEndDate,
  getTags,
  setTags,
  getEditRestriction,
  setEditRestriction,
  isEditor,
  getPlaylistLocation,
  setPlaylistLocation,
  setPlaylistName,
  getPlaylistName,
};
