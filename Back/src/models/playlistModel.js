import mongoose from 'mongoose';
import MusicModel from './userModel';


const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    allowVotes: {
        type: Boolean,
        required: true,
        default: false,
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'UserModel',
    }
});

/*
    Erase all musics associated with the playlist before removing it.
 */

playlistSchema.pre('remove', function (next) {

    MusicModel.find({playlist: this._id}, (error, musics) => {
        if (error) {
            console.error(error.msg);
        }
        else if (musics.length) {
            musics.forEach((music) => {
                music.remove();
            })
        }
        next();
    });
});

const PlaylistModel = mongoose.model('PlaylistModel', playlistSchema);

export default PlaylistModel;