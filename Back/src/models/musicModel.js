import mongoose from 'mongoose';
import VoteModel from './voteModel';

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
  },
  date: {
    type: Date,
    default: undefined,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
  },
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlaylistModel',
    default: undefined,
  },
  albumCover: {
    type: String,
  },
  preview: {
    type: String,
  },
  link: {
    type: String,
  },
  path: {
    type: String,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

/*
    Erase all votes associated with the musicController before removing it.
 */

musicSchema.pre('remove', function (next) {
  VoteModel.find({ music: this._id }, (error, votes) => {
    if (error) {
      console.error(error.msg);
    } else if (votes.length) {
      votes.forEach((vote) => {
        vote.remove();
      });
    }
    next();
  });
});

const MusicModel = mongoose.model('MusicModel', musicSchema);

export default MusicModel;
