import mongoose from 'mongoose';

const uniqueValidator = require('mongoose-unique-validator');

const tokenSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'UserModel',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 43200,
  },
});
tokenSchema.plugin(uniqueValidator);

const TokenModel = mongoose.model('TokenModel', tokenSchema);

export default TokenModel;
