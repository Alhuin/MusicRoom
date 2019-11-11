import MusicModel from '../src/models/musicModel';

const mongoose = require('mongoose');

const musicData = {
  title: 'title',
  artist: 'artist',
  album: 'album',
  date: new Date(),
  user: mongoose.Types.ObjectId(),
  playlist: mongoose.Types.ObjectId(),
  albumCover: 'albumCover',
  preview: 'preview',
  link: 'link',
  path: 'path',
  votes: 2,
};

describe('Music Model Tests', () => {
  // It's just so easy to connect to the MongoDB Memory Server
  // By using mongoose.connect
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      });
  });

  it('create & save music successfully', async () => {
    const validMusic = new MusicModel(musicData);
    const savedMusic = await validMusic.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedMusic._id).toBeDefined();
    expect(savedMusic.title).toBe(musicData.title);
    expect(savedMusic.artist).toBe(musicData.artist);
    expect(savedMusic.album).toBe(musicData.album);
    expect(savedMusic.artist).toBe(musicData.artist);
    expect(savedMusic.date).toBe(musicData.date);
    expect(savedMusic.user).toBe(musicData.user);
    expect(savedMusic.playlist).toBe(musicData.playlist);
    expect(savedMusic.albumCover).toBe(musicData.albumCover);
    expect(savedMusic.preview).toBe(musicData.preview);
    expect(savedMusic.link).toBe(musicData.link);
    expect(savedMusic.path).toBe(musicData.path);
    expect(savedMusic.votes).toBe(musicData.votes);
  });

  // Test Schema is working!!!
  // You shouldn't be able to add in any field that isn't defined in the schema
  it('insert music successfully, but the field not defined in schema should be undefined', async () => {
    const musicWithInvalidField = new MusicModel({
      title: 'title',
      artist: 'artist',
      album: 'album',
      date: new Date(),
      user: mongoose.Types.ObjectId(),
      playlist: mongoose.Types.ObjectId(),
      albumCover: 'albumCover',
      preview: 'preview',
      link: 'link',
      path: 'path',
      votes: 2,
      undefinedField: 'undefinedField',
    });
    const savedMusicWithInvalidField = await musicWithInvalidField.save();
    expect(savedMusicWithInvalidField._id).toBeDefined();
    expect(savedMusicWithInvalidField.undefinedField).toBeUndefined();
  });

  // Test Validation is working!!!
  // It should us told us the errors in on gender field.
  it('create music without required field should failed', async () => {
    const musicWithoutTitleField = new MusicModel({
      artist: 'artist',
      album: 'album',
      date: new Date(),
      user: mongoose.Types.ObjectId(),
      playlist: mongoose.Types.ObjectId(),
      albumCover: 'albumCover',
      preview: 'preview',
      link: 'link',
      path: 'path',
      votes: 2,
    });
    let err;
    try {
      const savedMusicWithoutTitleField = await musicWithoutTitleField.save();
      error = savedMusicWithoutTitleField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.title).toBeDefined();
  });
});
