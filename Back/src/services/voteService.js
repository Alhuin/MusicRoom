import VoteModel from '../models/voteModel';
import CustomError from './errorHandler';

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

export default {
  getVotes,
  getVoteById,
  deleteVoteById,
};
