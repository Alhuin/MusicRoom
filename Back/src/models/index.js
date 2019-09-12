import mongoose from 'mongoose';
import UserModel from './userModel';
import MusicModel from './musicModel';
import PlaylistModel from './playlistModel';
import VoteModel from './voteModel';
import TokenModel from './tokenModel';

const models = {
  UserModel,
  MusicModel,
  PlaylistModel,
  VoteModel,
  TokenModel,
};

const connectDb = () => mongoose.connect(
  process.env.DATABASE_URL,
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      throw (err);
    }
  },
);

export { connectDb };

export default models;
