import mongoose from 'mongoose';
import UserModel from './userModel';
import MusicModel from './musicModel';
import PlaylistModel from './playlistModel';
import VoteModel from './voteModel';
import TokenModel from './tokenModel';

const models = {
  User: UserModel,
  Music: MusicModel,
  Playlist: PlaylistModel,
  Vote: VoteModel,
  Token: TokenModel,
};

const connectDb = () => mongoose
  .connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('DB Connected!'))
  .catch((err) => console.log(`DB Connection Error: ${err.message}`));

mongoose.set('useCreateIndex', true);

export { connectDb };

export default models;
