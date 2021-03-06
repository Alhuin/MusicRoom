import mongoose from 'mongoose';
import MusicModel from './musicModel';

const uniqueValidator = require('mongoose-unique-validator');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
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
  },
  admins: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'UserModel',
  },
  bans: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'UserModel',
    default: [],
  },
  publicFlag: {
    type: Boolean,
    default: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
  },
  authorName: {
    type: String,
  },
  delegatedPlayerAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
  },
  roomType: {
    type: String,
    default: 'radio',
  },
  startDate: {
    type: Date,
    default: new Date(Date.now()),
  },
  endDate: {
    type: Date,
    default: new Date(Date.now() + 1000),
  },
  location: {
    type: {},
    default: {},
  },
  privateId: {
    type: String,
  },
  musics: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'MusicModel',
    default: [],
  },
  tags: {
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
  editRestriction: {
    type: String,
    default: 'ALL', // OR 'USER_RESTRICTED' OR 'ADMIN_RESTRICTED' OR 'EVENT_RESTRICTED' if it's a party room
  },
  nowPlaying: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
});
playlistSchema.plugin(uniqueValidator);

/*
    Erase all musics associated with the playlist before removing it.
 */

playlistSchema.pre('remove', function (next) {
  MusicModel.find({ playlist: this._id }, (error, musics) => {
    if (error) {
      console.error(error.msg);
    } else if (musics.length) {
      musics.forEach((music) => {
        music.remove();
      });
    }
    next();
  });
});

const PlaylistModel = mongoose.model('PlaylistModel', playlistSchema);

export default PlaylistModel;
