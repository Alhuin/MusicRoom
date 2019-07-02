import mongoose from 'mongoose';

import User from './user';
import Music from './music';
import Playlist from './playlist';
import Vote from './vote';
import Token from './token';

const models = { User, Music, Playlist, Vote, Token };

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