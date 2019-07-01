import mongoose from 'mongoose';
import Music from './music';


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
        ref: 'User',
    }
});

/*
    Erase all musics associated with the playlist before removing it.
 */

playlistSchema.pre('remove', function (next) {

    Music.find({playlist: this._id}, (err, musics) => {
        if (err) {
            console.log(err);
        }
        else if (musics.length) {
            musics.forEach((music) => {
                music.remove();
            })
        }
        next();
    });
});

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;