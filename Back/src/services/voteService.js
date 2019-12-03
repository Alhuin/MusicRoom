import VoteModel from '../models/voteModel';
import CustomError from './errorHandler';
import MusicModel from '../models/musicModel';
import PlaylistModel from '../models/playlistModel';
import utils from '../utils';

function getVotes() {
  return new Promise((resolve, reject) => {
    VoteModel.find({}, (error, votes) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else {
        resolve({
          status: 200,
          data: votes,
        });
      }
    });
  });
}

function getVoteById(voteId) {
  return new Promise((resolve, reject) => {
    VoteModel.findById(voteId, (error, vote) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!vote) {
        reject(new CustomError('GetVote', 'No vote with this id found in database', 404));
      } else {
        resolve({
          status: 200,
          data: vote,
        });
      }
    });
  });
}

function getMyVotesInPlaylist(userId, playlistId) {
  return new Promise((resolve, reject) => {
    VoteModel.find({ playlist: playlistId, user: userId }, (error, votes) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else {
        resolve({
          status: 200,
          data: votes,
        });
      }
    });
  });
}

function deleteVoteById(voteId) {
  return new Promise((resolve, reject) => {
    VoteModel.findById(voteId, (error, vote) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!vote) {
        reject(new CustomError('DeleteVoteById', 'No vote with this id found in database', 404));
      } else {
        vote.remove((removeError, removedVote) => {
          if (removeError) {
            reject(new CustomError('MongoError', removeError.message, 500));
          } else {
            resolve({
              status: 200,
              data: removedVote,
            });
          }
        });
      }
    });
  });
}

function voteMusic(userId, musicId, playlistId, value, pos) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!playlist) {
        reject(new CustomError('voteMusic', 'No playlist with this id in database', 400));
      } else if (utils.isEditorInPlaylist(playlist, userId, pos)) {
        VoteModel
          .find({ user: userId, music: musicId, playlist: playlistId }, (voteError, votes) => {
            if (voteError) {
              reject(new CustomError('MongoError', voteError.message, 500));
            } else {
              MusicModel.find({ _id: musicId, playlist: playlistId }, (findError, music) => {
                if (findError) {
                  reject(new CustomError('MongoError', findError.message, 500));
                } else if (!music[0]) {
                  reject(new CustomError('VoteMusic', 'No music with this id in database', 400));
                } else if (votes[0]) {
                  if (votes[0].value === value) {
                    const updatedMusic = music[0];
                    updatedMusic.votes -= value;
                    updatedMusic.save((saveError, savedMusic) => {
                      if (saveError) {
                        reject(new CustomError('MongoError', saveError.message, 500));
                      } else {
                        deleteVoteById(votes[0]._id)
                          .then((response) => {
                            resolve({
                              status: response.status,
                              data: savedMusic,
                            });
                          })
                          .catch((errorVote) => {
                            reject(errorVote);
                          });
                      }
                    });
                  } else {
                    const updatedMusic = music[0];
                    updatedMusic.votes += value * 2;
                    updatedMusic.save((saveError, savedMusic) => {
                      if (saveError) {
                        reject(new CustomError('MongoError', saveError.message, 500));
                      } else {
                        const updatedVote = votes[0];
                        updatedVote.value = value;
                        updatedVote.save((voteSaveError) => {
                          if (voteSaveError) {
                            reject(new CustomError('MongoError', voteSaveError.message, 500));
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
                } else {
                  const updatedMusic = music[0];
                  updatedMusic.votes += value;
                  updatedMusic.save((saveError, savedMusic) => {
                    if (saveError) {
                      reject(new CustomError('MongoError', saveError.message, 500));
                    } else {
                      const newVote = new VoteModel({
                        playlist: playlistId,
                        music: musicId,
                        user: userId,
                        value,
                      });
                      newVote.save((voteSaveError) => {
                        if (voteSaveError) {
                          reject(new CustomError('MongoError', voteSaveError.message, 500));
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
      } else {
        reject(new CustomError('voteMusic', 'Not authorized', 401));
      }
    });
  });
}

export default {
  getVotes,
  getVoteById,
  deleteVoteById,
  voteMusic,
  getMyVotesInPlaylist,
};
