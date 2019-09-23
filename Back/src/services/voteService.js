import VoteModel from '../models/voteModel';
import CustomError from './errorHandler';
import MusicModel from '../models/musicModel';

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
        reject(new CustomError('DeleteVote', 'No vote with this id found in database', 404));
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

function voteMusic(userId, musicId, playlistId, value) {
  return new Promise((resolve, reject) => {
    VoteModel.find({ user: userId, music: musicId, playlist: playlistId }, (voteError, votes) => {
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
                    .catch((error) => {
                      console.error(error.msg);
                      resolve({
                        status: error.status,
                        data: error.msg,
                      });
                    });
                }
              });
            } else {
              // si votes = 1 et que je upvote -> votes = 2. Je downvote (cas présent) -> votes = 0.    0w0'
              const updatedMusic = music[0];
              updatedMusic.votes += value * 2; // explain pourquoi x2 ?
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
  });
}

export default {
  getVotes,
  getVoteById,
  deleteVoteById,
  voteMusic,
  getMyVotesInPlaylist,
};
