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
        ref: 'User'
    },
    music: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Music'
    }
});

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;