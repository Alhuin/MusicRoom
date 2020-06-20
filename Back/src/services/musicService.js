import 'dotenv/config';
import MusicModel from '../models/musicModel';
import CustomError from './errorHandler';
import playlistService from './playlistService';
import PlaylistModel from '../models/playlistModel';

function getMusics() {
  return new Promise((resolve, reject) => MusicModel.find(
    {},
    (error, musics) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else {
        resolve({
          status: 200,
          data: musics,
        });
      }
    },
  ));
}

function getMusicById(musicId) {
  return new Promise((resolve, reject) => MusicModel.findById(
    musicId,
    (error, music) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!music) {
        reject(new CustomError('GetMusicById', 'No music with this id in database', 404));
      } else {
        resolve({
          status: 200,
          data: music,
        });
      }
    },
  ));
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
    } else {
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
                const res = [];
                let musicsTmp = musics;
                order.forEach((key) => {
                  let found = false;
                  musicsTmp = musicsTmp.filter((item) => {
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
    }
  });
}

function deleteMusicById(musicId) {
  return new Promise((resolve, reject) => MusicModel.findById(
    musicId,
    (findError, music) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (!music) {
        reject(new CustomError('DeleteMusic', 'No music with this id in database', 404));
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
    },
  ));
}

function downloadMusic(musicUrl) {
  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    let stdout = '';
    let stderr = '';
    const deezpy = spawn('deemix', ['-l', musicUrl], { cwd: './downloads' });

    deezpy.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    deezpy.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    deezpy.on('close', (code) => {
      if (code !== 0) {
        reject(new CustomError('DeezPy', stderr, 500));
      } else {
        const fileName = stderr.match(/\[(.*?)]\sTrack download completed/);
        const dir = stderr.match(/download folder:\s(.*?)\n/);
        if (fileName === null) {
          // TODO Catch Token expired + No Space Left
          reject(new CustomError('DeezPy', stdout, 500));
        }
        resolve({
          status: 200,
          data: `${__dirname}/../../downloads/${dir[1]}/${fileName[1].replace('?', '_')}.mp3`,
        });
      }
    });
  });
}

function addMusicToPlaylist(playlistId, userId, artist, title, album, albumCover, preview, link,
  roomType) {
  return new Promise((resolve, reject) => {
    isNotInPlaylist(playlistId, link)
      .then(() => {
        downloadMusic(link)
          .then((path) => {
            const staticMusicPath = path.data.replace(`${__dirname}/../../downloads`, `${process.env.SERVER}:${process.env.EXPRESS_PORT}/tracks`);
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
              path: staticMusicPath,
              votes: 0,
            });
            music.save((saveError, savedMusic) => {
              if (saveError) {
                reject(new CustomError('MongoError', saveError.message, 500));
              } else if (String(roomType) === 'radio') {
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
              } else if (saveError) {
                reject(new CustomError('MongoError', saveError.message, 500));
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
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function isNotInPlaylist(playlistId, link) {
  return new Promise((resolve, reject) => {
    MusicModel.find({ link, playlist: playlistId }, (findError, musics) => {
      if (findError) {
        reject(new CustomError('MongoError', findError.message, 500));
      } else if (musics[0]) {
        reject(new CustomError('isNotInPlayist', 'This music is already in the playlist !', 400));
      } else {
        resolve({
          status: 200,
          data: { isNotInPlaylist: true },
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
