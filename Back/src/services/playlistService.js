import PlaylistModel from '../models/playlistModel';
import CustomError from './errorHandler';
import models from '../models';
import UserModel from '../models/userModel';
import MusicModel from '../models/musicModel';
import utils from '../utils';

function getPlaylists() {
  return new Promise((resolve, reject) => PlaylistModel.find(
    {},
    (findError, playlists) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else {
        resolve({
          status: 200,
          data: playlists,
        });
      }
    },
  ));
}

function getPlaylistById(playlistId) {
  return new Promise((resolve, reject) => PlaylistModel.findById(
    playlistId,
    (findError, playlist) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (!playlist) {
        reject(new CustomError('GetPlaylist', 'No playlist with this id in database', 404));
      } else {
        resolve({
          status: 200,
          data: playlist,
        });
      }
    },
  ));
}

function getPlaylistName(playlistId) {
  return new Promise((resolve, reject) => PlaylistModel.findById(
    playlistId,
    (findError, playlist) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (!playlist) {
        reject(new CustomError('GetPlaylistName', 'No playlist with this id in database', 404));
      } else {
        resolve({
          status: 200,
          data: playlist,
        });
      }
    },
  ));
}

function getPublicityOfPlaylistById(playlistId) {
  return new Promise((resolve, reject) => PlaylistModel.findById(
    playlistId,
    (findError, playlist) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (!playlist) {
        reject(new CustomError('IsPlaylistPublic', 'No playlist with this id in database', 404));
      } else {
        resolve({
          status: 200,
          data: playlist.publicFlag,
        });
      }
    },
  ));
}

function getPlaylistsFilteredByRoom(roomType) {
  return new Promise((resolve, reject) => PlaylistModel.find(
    { roomType },
    (error, playlists) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else {
        resolve({
          status: 200,
          data: playlists,
        });
      }
    },
  ));
}

function getPlaylistsFiltered(roomType, userId) {
  return new Promise((resolve, reject) => PlaylistModel.find(
    { roomType },
    (findError, playlists) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else {
        const isPublicOrIncludesUser = (playlist) => playlist.publicFlag
          || playlist.users.includes(userId);
        const filteredPlaylists = playlists.filter(isPublicOrIncludesUser);

        resolve({
          status: 200,
          data: filteredPlaylists,
        });
        // for (let i = 0; i < playlists.length; i += 1) {
        // if (!playlists[i].publicFlag) {
        //   let flag = false;
        //   for (let j = 0; j < playlists[i].users.length; j += 1) {
        //     if (String(playlists[i].users[j]._id) === userId) {
        //       flag = true;
        //     }
        //   }
        //   if (flag === false) {
        //     playlists.splice(i, 1);
        //     i -= 1;
        //   }
        // }
        // }
      }
    },
  ));
}

function addPlaylist(name, publicFlag, userId, author, authorName,
  delegatedPlayerAdmin, roomType, startDate, endDate, location, privateId) {
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
      startDate,
      endDate,
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
        reject(new CustomError('DeletePlaylist', 'No playlist with this id in database', 404));
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

function deletePlaylistByAdmin(playlistId, userId) {
  return new Promise((resolve, reject) => {
    if (utils.isAdminInPlaylist(playlistId, userId)) {
      PlaylistModel.findById(playlistId, (error, playlist) => {
        if (error) {
          reject(new CustomError('MongoError', error.message, 500));
        } else if (!playlist) {
          reject(new CustomError('DeletePlaylistByAdmin', 'No playlist with this id in database', 404));
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
    } else {
      reject(new CustomError('DeletePlaylistByAdmin', 'Not authorized', 401));
    }
  });
}

function isAdmin(userId, playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('IsAdmin', 'No playlist with this id in database', 404));
      } else {
        resolve({
          status: 200,
          data: utils.isAdminInPlaylist(playlist, userId),
        });
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
        reject(new CustomError('GetAdminsByPlaylistId', 'No playlist with this id in database', 404));
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
        reject(new CustomError('AdminInPlaylistDowngrade', 'No playlist with this id in database', 404));
      } else if (utils.isAdminInPlaylist(playlist, requesterId)
          && utils.isAdminInPlaylist(playlist, userId)) {
        for (let i = 0; i < playlist.admins.length; i += 1) {
          if (String(playlist.admins[i]._id) === String(userId)
            && String(playlist.admins[i]._id) !== String(playlist.delegatedPlayerAdmin)) {
            playlist.admins.splice(i, 1);
            playlist.save((saveError) => {
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

function userInPlaylistUpgrade(playlistId, userId, requesterId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('UserInPlaylistUpgrade', 'No playlist with this id in database', 404));
      } else if (utils.isAdminInPlaylist(playlist, requesterId)) {
        if (!utils.isAdminInPlaylist(playlist, userId)) {
          for (let i = 0; i < playlist.users.length; i += 1) {
            if (String(playlist.users[i]._id) === String(userId)
              && String(playlist.users[i]._id) !== String(playlist.delegatedPlayerAdmin)) {
              playlist.admins.push(userId);
              playlist.save((saveError) => {
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
    });
  });
}

function deleteUserInPlaylist(playlistId, userId, isUserAdmin, requesterId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('deleteUserInPlaylist', 'No playlist with this id in database', 404));
      } else if ((String(requesterId) === String(userId))
        || utils.isAdminInPlaylist(playlist, requesterId)) {
        for (let i = 0; i < playlist.users.length; i += 1) {
          if (String(playlist.users[i]._id) === String(userId)
            && String(playlist.users[i]._id) !== String(playlist.delegatedPlayerAdmin)) {
            playlist.users.splice(i, 1);
            if (utils.isAdminInPlaylist(playlist, userId) /* isUserAdmin */) {
              for (let j = 0; j < playlist.admins.length; j += 1) {
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
      } else {
        reject(new CustomError('DeleteUserInPlaylist', 'Not authorized', 401));
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
        reject(new CustomError('banUserInPlaylist', 'No playlist with this id in database', 404));
      } else if (utils.isAdminInPlaylist(playlist, requesterId)) {
        for (let i = 0; i < playlist.users.length; i += 1) {
          if (String(playlist.users[i]._id) === String(userId)
            && String(playlist.users[i]._id) !== String(playlist.delegatedPlayerAdmin)) {
            playlist.users.splice(i, 1);
            if (utils.isAdminInPlaylist(playlist, userId) /* isUserAdmin */) {
              for (let j = 0; j < playlist.admins.length; j += 1) {
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
    });
  });
}

function addUserToPlaylistAndUnbanned(playlistId, userId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('addUserToPlaylistAndUnbanned', 'No playlist with this id in database', 404));
      } else {
        for (let i = 0; i < playlist.bans.length; i += 1) {
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

function getNextTrackByVote(playlistId) {
  return new Promise((resolve, reject) => {
    MusicModel.find({ playlist: playlistId })
      .sort({ votes: -1 })
      .limit(1)
      .exec((error, tracks) => {
        if (error) {
          reject(new CustomError('MongoError', error.message, 500));
        } else {
          let formatedTrack = {};
          if (tracks[0]) {
            formatedTrack = {
              id: tracks[0]._id,
              audioUrl: tracks[0].path,
              albumArtUrl: tracks[0].albumCover,
              artist: tracks[0].artist,
              title: tracks[0].title,
              album: tracks[0].album,
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

function joinPlaylistWithCode(userId, playlistCode) {
  return new Promise((resolve, reject) => PlaylistModel.find(
    { privateId: playlistCode },
    (error, playlists) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlists[0]) {
        reject(new CustomError('JoinPlaylistWithCode', 'No playlist with this id in database', 404));
      } else {
        const newPlaylist = playlists[0];
        if (!newPlaylist.bans.includes(userId)
          && !newPlaylist.admins.includes(userId)
          && !newPlaylist.users.includes(userId)) {
          newPlaylist.users.push(userId);
        }
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
    },
  ));
}

function joinPlaylistWithId(userId, playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('JoinPlaylistWithId', 'No playlist with this id in database', 404));
      } else {
        const newPlaylist = playlist;
        if (!newPlaylist.bans.includes(userId)
          && !newPlaylist.admins.includes(userId)
          && !newPlaylist.users.includes(userId)) {
          newPlaylist.users.push(userId);
        }
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
        reject(new CustomError('getPlaylistPrivateId', 'No playlist with this id in database', 404));
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
        reject(new CustomError('getDelegatedPlayerAdmin', 'No playlist with this id in database', 404));
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
      } else if (!playlist) {
        reject(new CustomError('setPublicityOfPlaylist', 'No playlist with this id found in database', 404));
      } else {
        const newPlaylist = playlist;
        newPlaylist.publicFlag = value;
        newPlaylist.save((saveError, savedPlaylist) => {
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

function setDelegatedPlayerAdmin(playlistId, userId, requesterId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('SetDelegatedPlayerAdmin', 'No playlist with this id in database', 404));
      } else {
        let isRequesterAdmin = false;
        if (String(requesterId) !== String(userId)) {
          for (let j = 0; j < playlist.admins.length; j += 1) {
            if (String(playlist.admins[j]._id) === String(requesterId)) {
              isRequesterAdmin = true;
            }
          }
        } else {
          isRequesterAdmin = true;
        }
        if (isRequesterAdmin) {
          const newPlaylist = playlist;
          for (let i = 0; i < playlist.admins.length; i += 1) {
            if (String(playlist.admins[i]._id) === String(userId)) {
              newPlaylist.delegatedPlayerAdmin = userId;
              break;
            }
          }
          newPlaylist.save((saveError, savedPlaylist) => {
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

/* return the index of the deleted music */

function deleteTrackFromPlaylist(playlistId, musicId) {
  return new Promise((resolve, reject) => {
    getPlaylistById(playlistId)
      .then((dataPlaylist) => {
        let i = 0;
        for (i = 0; i < dataPlaylist.data.musics.length; i += 1) {
          if (dataPlaylist.data.musics[i].toString() === musicId.toString()) {
            dataPlaylist.data.musics.splice(i, 1);
          }
        }
        dataPlaylist.data.save((saveError, savedPlaylist) => {
          if (saveError) {
            reject(new CustomError('MongoError', saveError.message, 500));
          } else {
            MusicModel.find({ playlist: playlistId, _id: musicId }, (error, musics) => {
              if (error) {
                reject(new CustomError('MongoError', error.message, 500));
              } else if (!musics[0]) {
                reject(new CustomError('DeleteTrackFromPlaylist', 'No Music with this id in database', 404));
              } else {
                musics[0].remove((removeError, removedMusic) => {
                  if (removeError) {
                    reject(new CustomError('MongoError', removeError, 500));
                  } else {
                    resolve({
                      status: 200,
                      data: { index: i },
                    });
                  }
                });
              }
            });
          }
        });
      })
      .catch((saveError) => {
        console.error(saveError);
      });
  });
}

/* return the index of the deleted music */

function deleteTrackFromPlaylistRight(playlistId, musicId, userId) {
  return new Promise((resolve, reject) => {
    getPlaylistById(playlistId)
      .then((response) => {
        const playlist = response.data;
        let flag = false;
        if ((playlist.roomType === 'radio' && utils.isEditorInPlaylist(playlist, userId, null))
        || (playlist.roomType === 'party' && utils.isAdminInPlaylist(playlist, userId))) {
          flag = true;
          console.log('flag de merde', flag);
        }
        if (flag) {
          // console.log(playlist.musics);
          // console.log('toRemove', musicId);
          // playlist.musics.filter((itemId) => itemId.toString() !== musicId.toString());
          // console.log(playlist.musics);

          let i = 0;
          for (i; i < playlist.musics.length; i += 1) {
            if (playlist.musics[i].toString() === musicId.toString()) {
              playlist.musics.splice(i, 1);
              console.log('splice');
            }
          }
          playlist.save((saveError, savedPlaylist) => {
            if (saveError) {
              reject(new CustomError('MongoError', saveError.message, 500));
            } else {
              MusicModel.find({ playlist: playlistId, _id: musicId }, (error, musics) => {
                if (error) {
                  reject(new CustomError('MongoError', error.message, 500));
                } else if (!musics[0]) {
                  reject(new CustomError('DeleteTrackFromPlaylistRight', 'No Music with this id in database', 404));
                } else {
                  musics[0].remove((removeError, removedMusic) => {
                    if (removeError) {
                      reject(new CustomError('MongoError', removeError, 500));
                    } else {
                      resolve({
                        status: 200,
                        data: { index: i },
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          reject(new CustomError('DeleteTrackFromPlaylistRight', 'Not Authorized', 401));
        }
      })
      .catch((saveError) => {
        console.error(saveError);
      });
  });
}

function moveTrackOrder(playlistId, musicId, newIndex) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('moveTrackOrder', 'No playlist with this id in database', 404));
      } else if (playlist.musics.length <= newIndex) {
        reject(new CustomError('moveTrackOrder', 'Error on newIndex parameter', 400));
      } else {
        for (let i = 0; i < playlist.musics.length; i += 1) {
          if (String(playlist.musics[i]._id) === String(musicId)) {
            playlist.musics.splice(i, 1);
            break;
          }
        }
        playlist.musics.splice(newIndex, 0, musicId);
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

function getPlaylistDates(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (findError, playlist) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (!playlist) {
        reject(new CustomError('GetPlaylistDates', 'No playlist with this id found in database', 404));
      } else {
        resolve({
          status: 200,
          data: [playlist.startDate, playlist.endDate],
        });
      }
    });
  });
}

function getTags(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (findError, playlist) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (!playlist) {
        reject(new CustomError('GetTags', 'No playlist with this id found in database', 404));
      } else {
        resolve({
          status: 200,
          data: playlist.tags,
        });
      }
    });
  });
}

function setTags(playlistId, tags) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (findError, playlist) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (!playlist) {
        reject(new CustomError('SetTags', 'No playlist with this id found in database', 404));
      } else {
        const newPlaylist = playlist;
        newPlaylist.tags = tags;
        newPlaylist.save((saveError, savedPlaylist) => {
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

function setStartDate(playlistId, newDate) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('setStartDate', 'No playlist with this id found in database', 404));
      } else if (newDate < playlist.endDate) {
        const newPlaylist = playlist;
        newPlaylist.startDate = newDate;
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
      } else {
        resolve({
          status: 200,
          data: playlist,
        });
      }
    });
  });
}

function setEndDate(playlistId, newDate) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('setEndDate', 'No playlist with this id found in database', 404));
      } else if (newDate > playlist.startDate) {
        const newPlaylist = playlist;
        newPlaylist.endDate = newDate;
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
      } else {
        resolve({
          status: 200,
          data: playlist,
        });
      }
    });
  });
}


function getEditRestriction(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (findError, playlist) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (!playlist) {
        reject(new CustomError('GetEditRestriction', 'No playlist with this id found in database', 404));
      } else {
        resolve({
          status: 200,
          data: playlist.editRestriction,
        });
      }
    });
  });
}

function setEditRestriction(playlistId, newEditRestriction) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (findError, playlist) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (!playlist) {
        reject(new CustomError('SetEditRestriction', 'No playlist with this id found in database', 404));
      } else {
        const newPlaylist = playlist;
        newPlaylist.editRestriction = newEditRestriction;
        newPlaylist.save((saveError, savedPlaylist) => {
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

function getPlaylistLocation(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (findError, playlist) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (!playlist) {
        reject(new CustomError('GetPlaylistLocation', 'No playlist with this id found in database', 404));
      } else {
        resolve({
          status: 200,
          data: playlist.location,
        });
      }
    });
  });
}

function setPlaylistLocation(playlistId, newLocation, userId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (findError, playlist) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (!playlist) {
        reject(new CustomError('SetPlaylistLocation', 'No playlist with this id found in database', 404));
      } else if (utils.isAdminInPlaylist(playlist, userId)) {
        const newPlaylist = playlist;
        Object.assign(newPlaylist.location, newLocation);
        newPlaylist.save((saveError, savedPlaylist) => {
          if (saveError) {
            reject(new CustomError('MongoError', saveError.message, 500));
          } else {
            resolve({
              status: 200,
              data: savedPlaylist,
            });
          }
        });
      } else {
        reject(new CustomError('SetPlaylistLocation', 'Not authorized', 401));
      }
    });
  });
}

function isEditor(playlistId, userId, pos) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('IsEditor', 'No playlist with this id in database', 400));
      } else {
        resolve({
          status: 200,
          data: utils.isEditorInPlaylist(playlist, userId, pos),
        });
      }
    });
  });
}

function setPlaylistName(playlistId, userId, newName) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (findError, playlist) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (!playlist) {
        reject(new CustomError('SetPlaylistName', 'No playlist with this id found in database', 404));
      } else if (utils.isAdminInPlaylist(playlist, userId)) {
        const newPlaylist = playlist;
        newPlaylist.name = newName;
        newPlaylist.save((saveError, savedPlaylist) => {
          if (saveError) {
            reject(new CustomError('MongoError', saveError.message, 500));
          } else {
            resolve({
              status: 200,
              data: savedPlaylist,
            });
          }
        });
      } else {
        reject(new CustomError('setPlaylistName', 'Not authorized', 401));
      }
    });
  });
}

function getNextRadioTrack(playlistId, currentTrackId, nextIndex) {
  return new Promise((resolve, reject) => {
    let musicId = null;

    PlaylistModel.findById(playlistId, (error, radio) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!radio) {
        reject(new CustomError('GetNextRadioTrack', 'No radio with this id in database', 404));
      } else if (!radio.musics[0]) {
        reject(new CustomError('GetNextRadioTrack', 'No musics in this radio', 400));
      } else if (nextIndex === -1) { // get next Track in list
        console.log(radio.musics);
        const index = radio.musics.indexOf(currentTrackId);
        if (index === radio.musics.length - 1) { // last track, loop to the beginning
          musicId = radio.musics[0];
        } else {
          musicId = radio.musics[index + 1];
        }
      } else if (nextIndex === radio.musics.length - 1) { // last track, loop to beginning
        musicId = radio.musics[0];
      } else {
        musicId = radio.musics[nextIndex];
      }
      if (musicId !== null) {
        MusicModel.findById(musicId, (findError, music) => {
          if (error) {
            reject(new CustomError('MongoError', findError.message, 500));
          } else if (!music) {
            reject(new CustomError('GetNextRadioTrack', 'No Music with this id in database', 404));
          } else {
            const formatedTrack = {
              id: music._id,
              audioUrl: music.path,
              albumArtUrl: music.albumCover,
              artist: music.artist,
              title: music.title,
              album: music.album,
            };
            resolve({
              status: 200,
              data: formatedTrack,
            });
          }
        });
      } else {
        reject(new CustomError('GetNextRadioTrack', 'No next music found !', 400));
      }
    });
  });
}

function getPrevRadioTrack(playlistId, currentTrackId, prevIndex) {
  return new Promise((resolve, reject) => {
    let musicId = null;
    PlaylistModel.findById(playlistId, (error, radio) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!radio) {
        reject(new CustomError('GetPrevRadioTrack', 'No radio with this id in database', 404));
      } else if (!radio.musics[0]) {
        reject(new CustomError('GetPrevRadioTrack', 'No musics in this radio', 400));
      } else if (prevIndex === -1) { // get prev Track in list
        const index = radio.musics.indexOf(currentTrackId);
        if (index === 0) { // first track, loop to the end
          musicId = radio.musics[radio.musics.length - 1];
        } else {
          musicId = radio.musics[index - 1];
        }
      } else if (prevIndex === 0) { // first track, loop to the end
        musicId = radio.musics[radio.musics.length - 1];
      } else {
        musicId = radio.musics[prevIndex - 1];
      }
      if (musicId !== null) {
        MusicModel.findById(musicId, (findError, music) => {
          if (error) {
            reject(new CustomError('MongoError', findError.message, 500));
          } else if (!music) {
            reject(new CustomError('GetPrevRadioTrack', 'No Music with this id in database', 404));
          } else {
            resolve({
              status: 200,
              data: music,
            });
          }
        });
      } else {
        reject(new CustomError('GetPrevRadioTrack', 'No previous music found !', 400));
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
  getNextRadioTrack,
  getPrevRadioTrack,
};
