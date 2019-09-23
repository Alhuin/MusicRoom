import MusicModel from '../models/musicModel';
import VoteModel from '../models/voteModel';
import CustomError from './errorHandler';
import voteService from './voteService';

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

function getMusicsByVote(playlistId) {
  return new Promise((resolve, reject) => {
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
    const deezpy = spawn('python3', ['/Users/dguelpa/Projects/appBranch/hMusicRoom/Back/src/deezpy/deezpy.py', '-l', musicUrl]);
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
