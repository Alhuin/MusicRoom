import VoteModel from '../models/voteModel';
import CustomError from './errorHandler';

function getVotes() {
  return new Promise((resolve, reject) => {
    VoteModel.find({}, (error, votes) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!votes.length) {
        reject(new CustomError('No votes in database', 400));
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
        reject(new CustomError(error, 500));
      } else if (!vote) {
        reject(new CustomError('No vote with this id in database', 400));
      } else {
        resolve({
          status: 200,
          data: vote,
        });
      }
    });
  });
}

function deleteVoteById(voteId) {
  return new Promise((resolve, reject) => {
    VoteModel.findById(voteId, (error, vote) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!vote) {
        reject(new CustomError('[No vote with this id in database', 400));
      } else {
        vote.remove((removeError, removedVote) => {
          if (removeError) {
            reject(removeError, 500);
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

export default {
  getVotes,
  getVoteById,
  deleteVoteById,
};
