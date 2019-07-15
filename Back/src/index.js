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
  const hashy = await bcrypt.hashSync('admin', salty);
  const admin = new models.User({
    login: 'admin',
    password: hashy,
    name: 'Julien',
    familyName: 'Janin-Reynaud',
    email: 'julien.janinr@protonmail.com',
    isVerified: true,
  });
  const playlist = new models.Playlist({
    name: 'AweSome PlaylistModel',
    users: [admin],
  });
  const music1 = new models.Music({
    name: 'Hit The Road Jack',
    artist: 'Ray Charles',
    user: user1,
    playlist,
  });
  const music2 = new models.Music({
    name: 'Kingdom Of Hardcore',
    artist: 'Unlogix',
    user: admin,
    playlist,
  });
  const vote1 = new models.Vote({
    value: 1,
    user: user1,
    music: music1,
  });
  const vote2 = new models.Vote({
    value: 1,
    user: admin,
    music: music2,
  });
  await admin.save();
  await user1.save();
  await playlist.save();
  await music1.save();
  await music2.save();
  await vote1.save();
  await vote2.save();
};
