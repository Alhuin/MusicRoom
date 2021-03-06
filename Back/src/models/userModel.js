import mongoose from 'mongoose';
import MusicModel from './musicModel';
import PlaylistModel from './playlistModel';
import VoteModel from './voteModel';

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: '',
  },
  familyName: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    default: '',
  },
  idDeezer: {
    type: String,
    trim: true,
    index: true,
    unique: true,
    sparse: true,
  },
  idGoogle: {
    type: String,
    trim: true,
    index: true,
    unique: true,
    sparse: true,
  },
  preferences: {
    type: {},
    default: {
      Rock: false,
      Rap: false,
      Classic: false,
      Electro: false,
      Reggae: false,
      Metal: false,
      Pop: false,
      Dub: false,
      Country: false,
    },
  },
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'UserModel',
    default: [],
  },
  visibilityTable: {
    type: {},
    default: {
      familyName: 'FRIEND_ONLY',
      email: 'PRIVATE',
      phoneNumber: 'FRIEND_ONLY',
      preferences: 'ALL',
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  premium: {
    type: Boolean,
    default: false,
  },
});

userSchema.statics.findByLoginOrEmail = async function (login) {
  let user = await this.find(login);
  if (!user) {
    user = await this.find({ email: login });
  }
  return user;
};
userSchema.plugin(uniqueValidator);

/*
    Remove the user from all playlists.users and remove all musics
    and votes associated with the user before removing it.
 */

userSchema.pre('remove', function (next) {
  VoteModel.find({ user: this._id }, (error, votes) => {
    if (error) {
      console.error(error.msg);
    } else if (votes.length) {
      votes.forEach((vote) => {
        vote.remove();
      });
    }
  });
  MusicModel.find({ user: this._id }, (error, musics) => {
    if (error) {
      console.error(error.msg);
    } else if (musics.length) {
      musics.forEach((music) => {
        music.remove();
      });
    }
  });
  PlaylistModel.find({}, (error, playlists) => {
    if (error) {
      console.error(error.msg);
    } else if (playlists.length) {
      playlists.forEach((playlist) => {
        const index = playlist.users.indexOf(this._id);
        if (index > -1) {
          playlist.users.splice(index, 1);
          playlist.save();
        }
      });
    }
  });
  next();
});

const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;
