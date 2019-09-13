import mongoose from 'mongoose';

const uniqueValidator = require('mongoose-unique-validator');

const radioSchema = new mongoose.Schema({
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlaylistModel',
    default: undefined,
  },
  admins: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'UserModel',
  },
  otherStuffToPutIn: {
    type: Number,
    // we could pull off author, name, users, allowVotes, public / private settings
    // from playlist to put them here
    // We could.
  },
});
radioSchema.plugin(uniqueValidator);

const RadioModel = mongoose.model('RadioModel', radioSchema);

export default RadioModel;
