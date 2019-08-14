import MusicModel from '../models/musicModel';
import VoteModel from '../models/voteModel';
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
      .sort({ votes: -1 })
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

function voteMusic(userId, musicId, playlistId, value) {
  console.log('voteMusic Service');
  return new Promise((resolve, reject) => {
    VoteModel.find({ user: userId, music: musicId, playlist: playlistId }, (voteError, votes) => {
      // console.log(votes);
      if (voteError) {
        reject(new CustomError(voteError, 500));
      } else if (votes[0]) {
        // console.log('already voted');
        reject(new CustomError('You already voted for this track.', 400));
      } else {
        MusicModel.find({ _id: musicId, playlist: playlistId }, (error, music) => {
          if (error) {
            reject(new CustomError(error, 500));
          } else if (!music[0]) {
            reject(new CustomError('No music with this id in database', 400));
          } else {
            const updatedMusic = music[0];
            updatedMusic.votes += value;
            updatedMusic.save((saveError, savedMusic) => {
              if (saveError) {
                reject(new CustomError(saveError, 500));
              } else {
                const newVote = new VoteModel({
                  playlist: playlistId,
                  music: musicId,
                  user: userId,
                  value,
                });
                newVote.save((voteSaveError) => {
                  if (voteSaveError) {
                    reject(new CustomError(voteSaveError, 500));
                  } else {
                    resolve({
                      status: 200,
                      data: savedMusic,
                    });
                  }
                });
              }
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

function addMusicToPlaylist(playlistId, userId, artist, title, album, albumCover, preview, link) {
  return new Promise((resolve, reject) => {
    downloadMusic(link)
      .then((path) => {
        console.log('Music DL OK');
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
            console.log('Music Save KO');
            reject(new CustomError(saveError, 500));
          } else {
            console.log('Music Save KO');
            resolve({
              status: 200,
              data: savedMusic,
            });
          }
        });
      })
      .catch((error) => {
        console.log('Music DL KO');
        reject(error);
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
  addMusicToPlaylist,
};
