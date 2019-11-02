import MusicModel from '../models/musicModel';
import CustomError from './errorHandler';
import playlistService from './playlistService';
import PlaylistModel from '../models/playlistModel';

function getMusics() {
  return new Promise((resolve, reject) => {
    MusicModel.find({}, (error, musics) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else {
        resolve({
          status: 200,
          data: musics,
        });
      }
    });
  });
}

function getMusicById(musicId) {
  return new Promise((resolve, reject) => {
    MusicModel.findById(musicId, (error, music) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!music) {
        reject(new CustomError('GetMusic', 'No music with this id found in database', 404));
      } else {
        resolve({
          status: 200,
          data: music,
        });
      }
    });
  });
}

function getMusicsByVote(playlistId, roomType) {
  return new Promise((resolve, reject) => {
    if (roomType === 'party') {
      MusicModel.find({ playlist: playlistId })
        .sort({ votes: -1 })
        .exec((error, musics) => {
          if (error) {
            reject(new CustomError('MongoError', error.message, 500));
          } else {
            resolve({
              status: 200,
              data: musics,
            });
          }
        });
    } else if (roomType === 'radio') {
      MusicModel.find({ playlist: playlistId })
        .exec((error, musics) => {
          if (error) {
            reject(new CustomError('MongoError', error.message, 500));
          } else {
            PlaylistModel.findById(playlistId, (findError, playlist) => {
              if (findError) {
                reject(new CustomError('MongoError', findError.message, 500));
              } else if (!playlist) {
                reject(new CustomError('GetPlaylist', 'No playlist with this id found in database', 404));
              } else {
                const order = playlist.musics;
                let res = [];
                order.forEach((key) => {
                  let found = false;
                  musics = musics.filter((item) => {
                    if (!found && String(item._id) === String(key)) {
                      res.push(item);
                      found = true;
                      return false;
                    }
                    return true;
                  });
                });
                resolve({
                  status: 200,
                  data: res,
                });
              }
            });
          }
        });
    } else {
      reject(new CustomError('getMusicsByVote', 'Wrong roomType', 500));
    }
  });
}

function deleteMusicById(musicId) {
  return new Promise((resolve, reject) => {
    MusicModel.findById(musicId, (error, music) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!music) {
        reject(new CustomError('DeleteMusic', 'No music with this id found in database', 404));
      } else {
        music.remove((removeError, musicRemoved) => {
          if (removeError) {
            reject(new CustomError('MongoError', removeError.message, 500));
          } else {
            resolve({
              status: 200,
              data: musicRemoved,
            });
          }
        });
      }
    });
  });
}

function downloadMusic(musicUrl) {
  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    let stdout = '';
    let stderr = '';
    const deezpy = spawn('python3', ['/Users/julien/Projects/MusicRoom/Back/src/deezpy/deezpy.py', '-l', musicUrl]);
    deezpy.stdout.on('data', (data) => {
      stdout += data;
    });

    deezpy.stderr.on('data', (data) => {
      stderr += data;
    });

    deezpy.on('close', (code) => {
      if (code !== 0) {
        reject(new CustomError('DeezPy', stderr, 500));
      } else {
        let path = stdout.replace('\n', '').match(/^Downloading: (.*)\.\.\.Done!$/);
        if (path === null) {
          path = stdout.replace('\n', '').match(/^(.*) already exists!$/);
        }
        resolve({
          status: 200,
          data: path[1],
        });
      }
    });
  });
}

/*
function addMusicToPlaylist(playlistId, userId, artist, title, album, albumCover, preview, link) {
  return new Promise((resolve, reject) => {
    downloadMusic(link)
      .then((path) => {
        const music = new MusicModel({
          user: userId,
          playlist: playlistId,
          artist,
          date: Date.now(),
          title,
          album,
          albumCover,
          preview,
          link,
          path: path.data,
          votes: 0,
        });
        music.save((saveError, savedMusic) => {
          if (saveError) {
            reject(new CustomError(saveError, 500));
          } else {
            resolve({
              status: 200,
              data: savedMusic,
            });
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}
*/

// si une musique existe deja, il y a un warning UnhandledPromiseRejectionWarning,
// mais la musique n'est pas add, as intended

function addMusicToPlaylist(playlistId, userId, artist, title, album, albumCover, preview, link) {
  return new Promise((resolve, reject) => {
    isMusicInPlaylist(playlistId, artist, title, album, albumCover, preview, link)
      .then((data) => {
        if (!data.data.length) {
          downloadMusic(link)
            .then((path) => {
              const staticMusicPath = path.data.replace('downloads', 'http://192.168.1.17:3000/tracks');
              const staticCoverPath = staticMusicPath.replace(staticMusicPath.split('/')[6], 'cover.png');
              const music = new MusicModel({
                user: userId,
                playlist: playlistId,
                artist,
                date: Date.now(),
                title,
                album,
                albumCover: staticCoverPath,
                preview,
                link,
                path: staticMusicPath,
                votes: 0,
              });
              music.save((saveError, savedMusic) => {
                if (saveError) {
                  reject(new CustomError('MongoError', saveError.message, 500));
                } else {
                  playlistService.getPlaylistById(playlistId)
                    .then((response) => {
                      response.data.musics.push(savedMusic._id);
                      response.data.save((saveError2, savedPlaylist) => {
                        if (saveError2) {
                          reject(new CustomError('MongoError', saveError2.message, 500));
                        } else {
                          resolve({
                            status: 200,
                            data: [savedMusic, savedPlaylist],
                          });
                        }
                      });
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
              });
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject(new CustomError('MusicService', `Strange, but it appears that a music exist in this playlist ${data.data}`, 500));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function isMusicInPlaylist(playlistId, artist, title, album, albumCover, preview, link) {
  return new Promise((resolve, reject) => {
    MusicModel.find({ link, playlistId }, (findError, musics) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else {
        resolve({
          status: 200,
          data: musics,
        });
      }
    });
  });
}

export default {
  getMusics,
  getMusicById,
  getMusicsByVote,
  deleteMusicById,
  downloadMusic,
  addMusicToPlaylist,
};
