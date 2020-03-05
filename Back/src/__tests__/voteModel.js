import VoteModel from '../models/voteModel';

const mongoose = require('mongoose');

const voteData = {
  value: 1,
  user: mongoose.Types.ObjectId(),
  music: mongoose.Types.ObjectId(),
  playlist: mongoose.Types.ObjectId(),
};

describe('Vote Model Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      });
  });

  it('create & save vote successfully', async () => {
    const validVote = new VoteModel(voteData);
    const savedVote = await validVote.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedVote._id).toBeDefined();
    expect(savedVote.value).toBe(voteData.value);
    expect(savedVote.user).toBe(voteData.user);
    expect(savedVote.music).toBe(voteData.music);
    expect(savedVote.playlist).toBe(voteData.playlist);
  });

  it('insert vote successfully, but the field not defined in schema should be undefined', async () => {
    const voteWithInvalidField = new VoteModel({
      value: 1,
      user: mongoose.Types.ObjectId(),
      music: mongoose.Types.ObjectId(),
      playlist: mongoose.Types.ObjectId(),
      undefinedField: 'undefinedField',
    });
    const savedVoteWithInvalidField = await voteWithInvalidField.save();
    expect(savedVoteWithInvalidField._id).toBeDefined();
    expect(savedVoteWithInvalidField.undefinedField).toBeUndefined();
  });

  it('create vote without required field should failed', async () => {
    const voteWithoutValueField = new VoteModel({
      user: mongoose.Types.ObjectId(),
      music: mongoose.Types.ObjectId(),
      playlist: mongoose.Types.ObjectId(),
    });
    let err;
    try {
      await voteWithoutValueField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.value).toBeDefined();
  });
});
