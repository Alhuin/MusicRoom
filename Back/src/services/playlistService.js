import PlaylistModel from '../models/playlistModel';
import CustomError from './errorHandler';
import models from '../models';
import UserModel from '../models/userModel';

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

function addPlaylist(name, publicFlag, userId, author, roomType) {
  return new Promise((resolve, reject) => {
    const playlist = new models.Playlist({
      name,
      author,
      publicFlag,
      users: [userId],
      allowVotes: true,
      roomType,
      authorName: author.name,
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

function adminInPlaylistDowngrade(playlistId, userId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('AdminInPlaylistDowngrade', 'No playlist with this id in database', 400));
      } else {
        for (let i = 0; i < playlist.admins.length; i++) {
          if (String(playlist.admins[i]._id) === String(userId) && String(playlist.admins[i]._id) !== String(playlist.author)) {
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
    });
  });
}

function userInPlaylistUpgrade(playlistId, userId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('UserInPlaylistUpgrade', 'No playlist with this id in database', 400));
      } else {
        let isItAdmin = false;
        for (let j = 0; j < playlist.admins.length; j++) {
          if (String(playlist.admins[j]._id) === String(userId)) {
            isItAdmin = true;
          }
        }
        if (!isItAdmin) {
          for (let i = 0; i < playlist.users.length; i++) {
            if (String(playlist.users[i]._id) === String(userId) && String(playlist.users[i]._id) !== String(playlist.author)) {
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
          reject(new CustomError('UserInPlaylistUpgrade', 'Already admin', 422));
        }
      }
    });
  });
}

function DeleteUserInPlaylist(playlistId, userId, isItAdmin) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('DeleteUserInPlaylist', 'No playlist with this id in database', 400));
      } else {
        for (let i = 0; i < playlist.users.length; i++) {
          if (String(playlist.users[i]._id) === String(userId) && String(playlist.users[i]._id) !== String(playlist.author)) {
            playlist.users.splice(i, 1);
            if (isItAdmin) {
              for (let j = 0; j < playlist.admins.length; j++) {
                if (String(playlist.admins[j]._id) === String(userId) && String(playlist.admins[j]._id) !== String(playlist.author)) {
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
                  data: true,
                });
              }
            });
            break;
          }
        }
      }
    });
  });
}

// this function shall additionnally keep these users kicked in a list, for no possible future joining
function KickUserInPlaylist(playlistId, userId, isItAdmin) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('KickUserInPlaylist', 'No playlist with this id in database', 400));
      } else {
        for (let i = 0; i < playlist.users.length; i++) {
          if (String(playlist.users[i]._id) === String(userId) && String(playlist.users[i]._id) !== String(playlist.author)) {
            playlist.users.splice(i, 1);
            if (isItAdmin) {
              for (let j = 0; j < playlist.admins.length; j++) {
                if (String(playlist.admins[j]._id) === String(userId) && String(playlist.admins[j]._id) !== String(playlist.author)) {
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
                  data: true,
                });
              }
            });
            break;
          }
        }
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
  adminInPlaylistDowngrade,
  userInPlaylistUpgrade,
  KickUserInPlaylist,
  DeleteUserInPlaylist,
};
