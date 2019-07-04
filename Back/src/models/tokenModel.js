import mongoose from 'mongoose';


const tokenSchema = new mongoose.Schema({
    type:{
      type: String,
      required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UserModel'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
});

const TokenModel = mongoose.model('TokenModel', tokenSchema);

export default TokenModel;