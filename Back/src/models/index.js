import mongoose from 'mongoose';

import UserModel from './userModel';
import MusicModel from './musicModel';
import PlaylistModel from './playlistModel';
import VoteModel from './voteModel';
import TokenModel from './tokenModel';

const models = { User: UserModel, Music: MusicModel, Playlist: PlaylistModel, Vote: VoteModel, Token: TokenModel };

const connectDb = () => {
    return mongoose.connect(
        process.env.DATABASE_URL,
        { useNewUrlParser: true },
        (err)=>{
            if (err){
                throw(err);
            }
        });
};


export { connectDb };

export default models;