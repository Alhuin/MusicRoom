import PlaylistModel from '../models/playlistModel';
import CustomError from './errorHandler';
import models from '../models';
import UserModel from '../models/userModel';
import MusicModel from '../models/musicModel';
import utils from '../utils';

function getPlaylists() {
  return new Promise((resolve, reject) => {
    PlaylistModel.find({}, (findError, playlists) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else {
        resolve({
          status: 200,
          data: playlists,
        });
      }
    });
  });
}

function getPlaylistById(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (findError, playlist) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (!playlist) {
        reject(new CustomError('GetPlaylist', 'No playlist with this id found in database', 404));
      } else {
        resolve({
          status: 200,
          data: playlist,
        });
      }
    });
  });
}

function getPublicityOfPlaylistById(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (findError, playlist) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (!playlist) {
        reject(new CustomError('GetPlaylist', 'No playlist with this id found in database', 404));
      } else {
        resolve({
          status: 200,
          data: playlist.publicFlag,
        });
      }
    });
  });
}

function getPlaylistsFilteredByRoom(roomType) {
  return new Promise((resolve, reject) => {
    PlaylistModel.find({ roomType }, (error, playlists) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else {
        resolve({
          status: 200,
          data: playlists,
        });
      }
    });
  });
}

function getPlaylistsFiltered(roomType, userId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.find({ roomType }, (error, playlists) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlists) {
        reject(new CustomError('PlaylistFiltered', 'No available playlist in database', 400));
      } else {
        for (let i = 0; i < playlists.length; i += 1) {
          if (!playlists.publicFlag) {
            let flag = false;
            for (let j = 0; j < playlists[i].users.length; j += 1) {
              if (String(playlists[i].users[j]._id) === userId) {
                flag = true;
              }
            }
            if (flag === false) {
              playlists.splice(i, 1);
              i -= 1;
            }
          }
        }
        if (!playlists) {
          reject(new CustomError('PlaylistFiltered', 'No available playlist in database', 400));
        } else {
          resolve({
            status: 200,
            data: playlists,
          });
        }
      }
    });
  });
}

function addPlaylist(name, publicFlag, userId, author, authorName, delegatedPlayerAdmin, roomType, date, dateTwo, location, privateId) {
  return new Promise((resolve, reject) => {
    const playlist = new models.Playlist({
      name,
      author,
      publicFlag,
      users: [userId],
      allowVotes: true,
      roomType,
      authorName,
      delegatedPlayerAdmin,
      admins: [author],
      date,
      dateTwo,
      location,
      privateId,
    });
    playlist.save((saveError, savedPlaylist) => {
      if (saveError) {
        reject(new CustomError('MongoError', saveError.message, 500));
      } else {
        resolve({
          status: 200,
          data: savedPlaylist,
        });
      }
    });
  });
}

function deletePlaylistById(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('DeletePlaylist', 'No playlist with this id in database', 400));
      } else {
        playlist.remove((removeError, removedPlaylist) => {
          if (removeError) {
            reject(new CustomError('MongoError', removeError, 500));
          } else {
            resolve({
              status: 200,
              data: removedPlaylist,
            });
          }
        });
      }
    });
  });
}

function isAdmin(userId, playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('IsAdmin', 'No playlist with this id in database', 400));
      } else {
        for (let i = 0; i < playlist.admins.length; i++) {
          if (String(playlist.admins[i]._id) === userId) {
            resolve({
              status: 200,
              data: true,
            });
          }
        }
      }
    });
  });
}

function getAdminsByPlaylistId(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('GetAdminsByPlaylistId', 'No playlist with this id in database', 400));
      } else {
        UserModel.find({
          _id: {
            $in: playlist.admins,
          },
        }, (err, admins) => {
          if (error) {
            reject(new CustomError('MongoError', error.message, 500));
          } else {
            resolve({
              status: 200,
              data: admins,
            });
          }
        });
      }
    });
  });
}

function getUsersByPlaylistId(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else {
        UserModel.find({
          _id: {
            $in: playlist.users,
          },
        }, (err, users) => {
          if (error) {
            reject(new CustomError('MongoError', error.message, 500));
          } else {
            resolve({
              status: 200,
              data: users,
            });
          }
        });
      }
    });
  });
}

function getBansByPlaylistId(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else {
        UserModel.find({
          _id: {
            $in: playlist.bans,
          },
        }, (err, bans) => {
          if (error) {
            reject(new CustomError('MongoError', error.message, 500));
          } else {
            resolve({
              status: 200,
              data: bans,
            });
          }
        });
      }
    });
  });
}

function adminInPlaylistDowngrade(playlistId, userId, requesterId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('AdminInPlaylistDowngrade', 'No playlist with this id in database', 400));
      } else {
        // que renvoyer si le requester n'est pas admin ? Une 200 et false ? Rejection ?
        if (utils.isAdminInPlaylist(playlist, requesterId) && utils.isAdminInPlaylist(playlist, userId)) {
          for (let i = 0; i < playlist.admins.length; i++) {
            if (String(playlist.admins[i]._id) === String(userId) && String(playlist.admins[i]._id) !== String(playlist.delegatedPlayerAdmin)) {
              playlist.admins.splice(i, 1);
              playlist.save((saveError, savedPlaylist) => {
                if (saveError) {
                  reject(new CustomError('MongoError', saveError.message, 500));
                } else {
                  resolve({
                    status: 200,
                    data: true,
                  });
                }
              });
            }
          }
        }
      }
    });
  });
}

function userInPlaylistUpgrade(playlistId, userId, requesterId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('UserInPlaylistUpgrade', 'No playlist with this id in database', 400));
      } else {
        // que renvoyer si le requester n'est pas admin ? Une 200 et false ? Rejection ?
        if (utils.isAdminInPlaylist(playlist, requesterId)) {
          if (!utils.isAdminInPlaylist(playlist, userId)) {
            for (let i = 0; i < playlist.users.length; i++) {
              if (String(playlist.users[i]._id) === String(userId) && String(playlist.users[i]._id) !== String(playlist.delegatedPlayerAdmin)) {
                playlist.admins.push(userId);
                playlist.save((saveError, savedPlaylist) => {
                  if (saveError) {
                    reject(new CustomError('MongodError', saveError.message, 500));
                  } else {
                    resolve({
                      status: 200,
                      data: true,
                    });
                  }
                });
              }
            }
          } else {
            reject(new CustomError('UserInPlaylistUpgrade', 'Already admin', 401));
          }
        }
      }
    });
  });
}

function deleteUserInPlaylist(playlistId, userId, isUserAdmin, requesterId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('deleteUserInPlaylist', 'No playlist with this id in database', 400));
      } else {
        if ((String(requesterId) === String(userId)) || utils.isAdminInPlaylist(playlist, requesterId)) {
          for (let i = 0; i < playlist.users.length; i++) {
            if (String(playlist.users[i]._id) === String(userId)
              && String(playlist.users[i]._id) !== String(playlist.delegatedPlayerAdmin)) {
              playlist.users.splice(i, 1);
              if (utils.isAdminInPlaylist(playlist, userId) /* isUserAdmin */) {
                for (let j = 0; j < playlist.admins.length; j++) {
                  if (String(playlist.admins[j]._id) === String(userId)
                    && String(playlist.admins[j]._id) !== String(playlist.delegatedPlayerAdmin)) {
                    playlist.admins.splice(j, 1);
                    break;
                  }
                }
              }
              playlist.save((saveError, savedPlaylist) => {
                if (saveError) {
                  reject(new CustomError('MongoError', saveError.message, 500));
                } else {
                  resolve({
                    status: 200,
                    data: savedPlaylist,
                  });
                }
              });
              break;
            }
          }
        }
      }
    });
  });
}

function banUserInPlaylist(playlistId, userId, isUserAdmin, requesterId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('banUserInPlaylist', 'No playlist with this id in database', 400));
      } else {
        if (utils.isAdminInPlaylist(playlist, requesterId)) {
          for (let i = 0; i < playlist.users.length; i++) {
            if (String(playlist.users[i]._id) === String(userId)
              && String(playlist.users[i]._id) !== String(playlist.delegatedPlayerAdmin)) {
              playlist.users.splice(i, 1);
              if (utils.isAdminInPlaylist(playlist, userId) /* isUserAdmin */) {
                for (let j = 0; j < playlist.admins.length; j++) {
                  if (String(playlist.admins[j]._id) === String(userId)
                    && String(playlist.admins[j]._id) !== String(playlist.delegatedPlayerAdmin)) {
                    playlist.admins.splice(j, 1);
                    break;
                  }
                }
              }
              if (!utils.isInBans(playlist, userId)) {
                playlist.bans.push(userId);
              }
              playlist.save((saveError, savedPlaylist) => {
                if (saveError) {
                  reject(new CustomError('MongoError', saveError.message, 500));
                } else {
                  resolve({
                    status: 200,
                    data: savedPlaylist,
                  });
                }
              });
              break;
            }
          }
        }
      }
    });
  });
}

function addUserToPlaylistAndUnbanned(playlistId, userId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('addUserToPlaylistAndUnbanned', 'No playlist with this id in database', 400));
      } else {
        for (let i = 0; i < playlist.bans.length; i++) {
          if (String(playlist.bans[i]) === String(userId)) {
            playlist.bans.splice(i, 1);
            break;
          }
        }
        if (!utils.isInUsers(playlist, userId)) {
          playlist.users.push(userId);
        }
        playlist.save((saveError, savedPlaylist) => {
          if (saveError) {
            reject(new CustomError('MongoError', saveError.message, 500));
          } else {
            resolve({
              status: 200,
              data: savedPlaylist,
            });
          }
        });
      }
    });
  });
}

function getNextTrack(playlistId) {
  return new Promise((resolve, reject) => {
    MusicModel.find({ playlist: playlistId })
      .sort({ votes: -1 })
      .limit(1)
      .exec((error, tracks) => {
        if (error) {
          reject(new CustomError('MongoError', error.message, 500));
        } else {
          let formatedTrack = null;
          if (tracks[0]) {
            formatedTrack = {
              id: tracks[0]._id,
              audioUrl: tracks[0].path,
              albumArtUrl: tracks[0].albumCover,
              artist: tracks[0].artist,
              title: tracks[0].title,
            };
          }
          resolve({
            status: 200,
            data: formatedTrack,
          });
        }
      });
  });
}

function joinPlaylist(userId, playlistCode) {
  return new Promise((resolve, reject) => {
    PlaylistModel.find({ privateId: playlistCode }, (error, playlists) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else {
        const newPlaylist = playlists[0];
        newPlaylist.users.push(userId);
        newPlaylist.save((saveError, savedPlaylist) => {
          if (saveError) {
            reject(new CustomError('MongoError', error.message, 500));
          } else {
            resolve({
              status: 200,
              data: savedPlaylist,
            });
          }
        });
      }
    });
  });
}

function getPlaylistPrivateId(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('getPlaylistPrivateId', 'No playlist with this id in database', 400));
      } else {
        resolve({
          status: 200,
          data: playlist.privateId,
        });
      }
    });
  });
}

function getDelegatedPlayerAdmin(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('getDelegatedPlayerAdmin', 'No playlist with this id in database', 400));
      } else {
        resolve({
          status: 200,
          data: playlist.delegatedPlayerAdmin,
        });
      }
    });
  });
}

function setPublicityOfPlaylist(playlistId, value) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else {
        playlist.publicFlag = value;
        playlist.save((saveError, savedPlaylist) => {
          if (saveError) {
            reject(new CustomError('MongoError', error.message, 500));
          } else {
            resolve({
              status: 200,
              data: savedPlaylist,
            });
          }
        });
      }
    });
  });
}

function setDelegatedPlayerAdmin(playlistId, userId, requesterId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('SetDelegatedPlayerAdmin', 'No playlist with this id in database', 400));
      } else {
        let isRequesterAdmin = false;
        if (String(requesterId) !== String(userId)) {
          for (let j = 0; j < playlist.admins.length; j++) {
            if (String(playlist.admins[j]._id) === String(requesterId)) {
              isRequesterAdmin = true;
            }
          }
        } else {
          isRequesterAdmin = true;
        }
        if (isRequesterAdmin) {
          for (let i = 0; i < playlist.admins.length; i++) {
            if (String(playlist.admins[i]._id) === String(userId)) {
              playlist.delegatedPlayerAdmin = userId;
              break;
            }
          }
          playlist.save((saveError, savedPlaylist) => {
            if (saveError) {
              reject(new CustomError('MongoError', saveError.message, 500));
            } else {
              resolve({
                status: 200,
                data: savedPlaylist,
              });
            }
          });
        }
      }
    });
  });
}

function deleteTrackFromPlaylist(playlistId, musicId) {
  return new Promise((resolve, reject) => {
    MusicModel.find({ playlist: playlistId, _id: musicId }, (error, musics) => {
      console.log(musics);
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!musics[0]) {
        reject(new CustomError('DeleteTrackFromPlaylist', 'No playlist with this id in database', 400));
      } else {
        musics[0].remove((removeError, removedMusic) => {
          if (removeError) {
            reject(new CustomError('MongoError', removeError, 500));
          } else {
            resolve({
              status: 200,
              data: removedMusic,
            });
          }
        });
      }
    });
  });
}

export default {
  getPlaylists,
  getPlaylistById,
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
  banUserInPlaylist,
  deleteUserInPlaylist,
  getNextTrack,
  addUserToPlaylistAndUnbanned,
  joinPlaylist,
  getPlaylistPrivateId,
  getDelegatedPlayerAdmin,
  setPublicityOfPlaylist,
  setDelegatedPlayerAdmin,
  deleteTrackFromPlaylist,
};
