/**
 *      API documentation: https://documenter.getpostman.com/view/6579841/S1a7UQAv?version=latest#authentication
 */

import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import models, { connectDb } from './models';
import API from './routes';

const bcrypt = require('bcrypt');

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/**
 *      Sets res.locals for all request
 *      - locals.models : the mongodb models
 *      - locals.me : the current user (not handled yet)
 */

app.use(async (req, res, next) => {
  res.locals = {
    models,
  };
  const users = await models.User.find({ login: 'Alhuin' });
  res.locals.me = await users[0];
  next();
});

app.use('/api', API);

connectDb().then(async () => {
  /* Erase the database if ERASE_DATABASE_ONSYNC is true in .env */
  if (process.env.ERASE_DATABASE_ONSYNC) {
    await Promise.all([
      models.Token.deleteMany({}),
      models.User.deleteMany({}),
      models.Music.deleteMany({}),
      models.Playlist.deleteMany({}),
      models.Vote.deleteMany({}),
    ]);
  }
  seedDatas();
  app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));
});

/**
 *      Init the database with datas
 */

const seedDatas = async () => {
  let roomType = 'party';
  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hashSync('Ge4rt3ln@', salt);
  const user1 = new models.User({
    login: 'Alhuin',
    password: hash,
    name: 'Jul',
    familyName: 'Janin-R',
    email: 'janin.reynaud.julien@gma',
  });
  const salty = await bcrypt.genSaltSync(10);
  const hashy = await bcrypt.hashSync('a', salty);
  const admin = new models.User({
    login: 'a',
    password: hashy,
    name: 'Julien',
    familyName: 'Janin-Reynaud',
    email: 'julien.janinr@protonmail.com',
    isVerified: true,
  });

  await admin.save();
  await user1.save();

  for (let i = 0; i < 5; i += 1) {
    if (i > 2) { roomType = 'radio'; }
    let playlist;
    if (i === 0) {
      playlist = new models.Playlist({
        name: `${i} - AweSome Playlist of heaven before the rise of Jesus and after the death of all haflings in Middle-Earth`,
        users: [user1],
        author: admin,
        roomType,
        publicFlag: true,
      });
    } else {
      playlist = new models.Playlist({
        name: `${i} - AweSome Playlist of heaven before the rise of Jesus and after the death of all haflings in Middle-Earth`,
        users: [admin],
        author: admin,
        roomType,
      });
    }
    playlist.save();
    const music1 = new models.Music({
      title: 'Hit The Road Jack',
      artist: 'Ray Charles',
      user: user1,
      playlist,
      album: 'Ray Charles, Grandes Exitos',
      preview: 'https://cdns-preview-2.dzcdn.net/stream/c-2193d7ef9f8d842ace9360836589727a-4.mp3',
      albumCover: 'https://api.deezer.com/album/14030736/image',
      votes: 1,
    });
    music1.save();
    const music2 = new models.Music({
      title: 'Kingdom Of Hardcore',
      artist: 'Unlogix',
      user: admin,
      playlist,
      album: 'Kingdom of Hardcore',
      albumCover: 'https://api.deezer.com/album/84599082/image',
      preview: 'https://cdns-preview-5.dzcdn.net/stream/c-594da52b1f185e066c91662de81c734b-2.mp3',
      votes: 0,
    });
    music2.save();
    const vote1 = new models.Vote({
      value: 1,
      user: user1._id,
      music: music1._id,
      playlist: playlist._id,
    });
    vote1.save();
    const vote2 = new models.Vote({
      value: 1,
      user: admin._id,
      music: music2._id,
      playlist: playlist._id,
    });
    vote2.save();
  }
};
