import VoteModel from '../models/voteModel'

function getVotes() {

    return new Promise((resolve, reject) => {

        VoteModel.find({}, (error, votes) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else if (!votes.length) {
                reject({
                    status: 401,
                    msg: 'No Votes in Database'
                })
            }
            else {
                resolve({
                    status: 200,
                    data: votes,
                })
            }
        });
    });
}

function getVoteById(voteId) {

    return new Promise((resolve, reject) => {

        VoteModel.findById(voteId, (error, vote) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else if (!vote) {
                reject({
                    status: 401,
                    msg: 'No Vote with this id in Database'
                })
            }
            else {
                resolve({
                    status: 200,
                    data: vote,
                })
            }
        });
    });
}

function deleteVoteById(voteId) {

    return new Promise((resolve, reject) => {

        VoteModel.findById(voteId, (error, vote) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else if (!vote) {
                reject({
                    status: 401,
                    msg: 'No Vote with this id in Database'
                })
            }
            else {
                vote.remove((error, vote) => {
                    if (error) {
                        reject({
                            status: 500,
                            msg: error.msg,
                        })
                    }
                    else {
                        resolve({
                            status: 200,
                            data: vote,
                        })
                    }
                })
            }
        });
    });
}

export default {
    getVotes,
    getVoteById,
    deleteVoteById,
}