import PlaylistModel from '../models/playlistModel';

const mongoose = require('mongoose');

const playlistData = {
  name: 'name',
  allowVotes: true,
  users: [mongoose.Types.ObjectId()],
  admins: [mongoose.Types.ObjectId()],
  bans: [mongoose.Types.ObjectId()],
  publicFlag: true,
  author: mongoose.Types.ObjectId(),
  authorName: 'authorName',
  delegatedPlayerAdmin: mongoose.Types.ObjectId(),
  roomType: 'party',
  startDate: new Date(),
  endDate: new Date(),
  location: 'locations',
  privateId: 'privateId',
  musics: [mongoose.Types.ObjectId()],
  tags: ['type'],
};

expect.extend({
  toContainObject(received, argument) {
    const pass = this.equals(received,
      expect.arrayContaining([
        expect.objectContaining(argument),
      ]));

    if (pass) {
      return {
        message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
        pass: true,
      };
    }
    return {
      message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
      pass: false,
    };
  },
});

describe('Playlist Model Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      });
  });

  it('create & save playlist successfully', async () => {
    const validPlaylist = new PlaylistModel(playlistData);
    const savedPlaylist = await validPlaylist.save();
    expect(savedPlaylist._id).toBeDefined();
    expect(savedPlaylist.name).toBe(playlistData.name);
    expect(savedPlaylist.allowVotes).toBe(playlistData.allowVotes);
    expect(savedPlaylist.users).toContainObject(playlistData.users[0]);
    expect(savedPlaylist.admins).toContainObject(playlistData.admins[0]);
    expect(savedPlaylist.bans).toContain(playlistData.bans[0]);
    expect(savedPlaylist.publicFlag).toBe(playlistData.publicFlag);
    expect(savedPlaylist.author).toBe(playlistData.author);
    expect(savedPlaylist.authorName).toBe(playlistData.authorName);
    expect(savedPlaylist.delegatedPlayerAdmin).toBe(playlistData.delegatedPlayerAdmin);
    expect(savedPlaylist.roomType).toBe(playlistData.roomType);
    expect(savedPlaylist.startDate).toBe(playlistData.startDate);
    expect(savedPlaylist.endDate).toBe(playlistData.endDate);
    expect(savedPlaylist.location).toBe(playlistData.location);
    expect(savedPlaylist.privateId).toBe(playlistData.privateId);
    expect(savedPlaylist.musics).toContainObject(playlistData.musics[0]);
    expect(savedPlaylist.tags).toContain(playlistData.tags[0]);
  });

  it('insert playlist successfully, but the field not defined in schema should be undefined', async () => {
    const playlistWithInvalidField = new PlaylistModel({
      name: 'name',
      allowVotes: true,
      users: [mongoose.Types.ObjectId()],
      admins: [mongoose.Types.ObjectId()],
      bans: [mongoose.Types.ObjectId()],
      publicFlag: true,
      author: mongoose.Types.ObjectId(),
      authorName: 'authorName',
      delegatedPlayerAdmin: mongoose.Types.ObjectId(),
      roomType: 'party',
      startDate: new Date(),
      endDate: new Date(),
      location: 'locations',
      privateId: 'privateId',
      musics: [mongoose.Types.ObjectId()],
      types: ['type'],
      undefinedField: 'undefinedField',
    });
    const savedPlaylistWithInvalidField = await playlistWithInvalidField.save();
    expect(savedPlaylistWithInvalidField._id).toBeDefined();
    expect(savedPlaylistWithInvalidField.undefinedField).toBeUndefined();
  });

  it('create playlist without required field should failed', async () => {
    const playlistWithoutNameField = new PlaylistModel({
      allowVotes: true,
      users: [mongoose.Types.ObjectId()],
      admins: [mongoose.Types.ObjectId()],
      bans: [mongoose.Types.ObjectId()],
      publicFlag: true,
      author: mongoose.Types.ObjectId(),
      authorName: 'authorName',
      delegatedPlayerAdmin: mongoose.Types.ObjectId(),
      roomType: 'party',
      startDate: new Date(),
      endDate: new Date(),
      location: 'locations',
      privateId: 'privateId',
      musics: [mongoose.Types.ObjectId()],
      types: ['type'],
    });
    let err;
    try {
      await playlistWithoutNameField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });
});
