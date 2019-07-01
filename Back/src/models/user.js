import mongoose from 'mongoose';
import Music from './music'
import Playlist from './playlist'
import Vote from './vote'

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    familyName: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

userSchema.statics.findByLoginOrEmail = async function (login) {
    let user = await this.find({login: login});

    if (!user) {
        user = await this.find({email: login});
    }

    return user;
};

/*
    Remove the user from all playlists.users and remove all musics and associated with the user before removing it.
 */

userSchema.pre('remove', function (next) {

    Vote.find({user: this._id}, (err, votes) => {
        if (err) {
            console.error(err);
        }
        else if (votes.length) {
            votes.forEach((vote) => {
                vote.remove();
            });
        }
    });

    Music.find({user: this._id}, (err, musics) => {
        if (err) {
            console.error(err);
        }
        else if (musics.length) {
            musics.forEach((music) => {
                music.remove();
            });
        }
    });

    Playlist.find({}, (err, playlists) => {
        if (err) {
            console.error(err)
        }
        else if (playlists.length) {
            playlists.forEach((playlist) => {
                let index = playlist.users.indexOf(this._id);
                if (index > -1) {
                    playlist.users.splice(index, 1);
                    playlist.save();
                }
            });
        }
    });
    next();
});

const User = mongoose.model('User', userSchema);

export default User;