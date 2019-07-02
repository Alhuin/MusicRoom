import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now(),
    },
    value: {
        type: Boolean,
        default: undefined,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    music: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MusicModel'
    }
});

const VoteModel = mongoose.model('VoteModel', voteSchema);

export default VoteModel;