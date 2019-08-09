import MusicModel from '../models/musicModel';
import CustomError from './errorHandler';

function getMusics() {
  return new Promise((resolve, reject) => {
    MusicModel.find({}, (error, musics) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!musics.length) {
        reject(new CustomError('No musics in database', 400));
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
        reject(new CustomError(error, 500));
      } else if (!music) {
        reject(new CustomError('No music with this id in databse', 400));
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
      .sort({ vote: -1 })
      .exec((error, musics) => {
        if (error) {
          reject(new CustomError(error, 500));
        } else if (!musics) {
          reject(new CustomError('No musics for this Playlist databse', 400));
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
        reject(new CustomError(error, 500));
      } else if (!music) {
        reject(new CustomError('No music with this id in database', 400));
      } else {
        music.remove((removeError, musicRemoved) => {
          if (removeError) {
            reject(new CustomError(removeError, 500));
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

function voteMusic(musicId, playlistId, value) {
  // console.log('voteMusic Service');
  return new Promise((resolve, reject) => {
    MusicModel.find({ _id: musicId, playlist: playlistId }, (error, music) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!music[0]) {
        reject(new CustomError('No music with this id in database', 400));
      } else {
        const updatedMusic = music[0];
        // console.log(updatedMusic);
        updatedMusic.vote += value;
        updatedMusic.save((saveError, savedMusic) => {
          if (saveError) {
            reject(new CustomError(saveError, 500));
          } else {
            resolve({
              status: 200,
              data: savedMusic,
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
    const deezpy = spawn('python3', ['/Users/jjanin-r/Projects/MusicRoom/Back/src/deezpy/deezpy.py', '-l', musicUrl]);
    deezpy.stdout.on('data', (data) => {
      stdout += data;
    });

    deezpy.stderr.on('data', (data) => {
      stderr += data;
    });

    deezpy.on('close', (code) => {
      if (code !== 0) {
        reject(new CustomError(stderr, 500));
      } else {
        const path = stdout.replace('\n', '').match(/^Downloading: (.*)\.\.\.Done!$/);
        resolve({
          status: 200,
          data: path[1],
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
  voteMusic,
  downloadMusic,
};
