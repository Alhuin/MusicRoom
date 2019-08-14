import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  value: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
  },
  music: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MusicModel',
  },
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlaylistModel',
  },
});

const VoteModel = mongoose.model('VoteModel', voteSchema);

export default VoteModel;
