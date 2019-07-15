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

export default {
  getMusics,
  getMusicById,
  deleteMusicById,
};
