import mongoose from 'mongoose';
import Vote from './vote'

const musicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    artist: {
       type: String,
       required: true,
    },
    date: {
        type: Date,
        default: undefined,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    playlist : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist',
        default: undefined,
    }
});

/*
    Erase all votes associated with the music before removing it.
 */

musicSchema.pre('remove', function(next) {
    Vote.find({music: this._id}, (err, votes) => {
        if (err) {
            console.log(err);
        }
        else if (votes.length) {
            votes.forEach((vote) => {
                vote.remove();
            })
        }
        next();
    });
});

const Music = mongoose.model('Music', musicSchema);

export default Music;