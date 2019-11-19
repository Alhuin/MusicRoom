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

const http = require('http');
const socketio = require('socket.io');

/**
 *          WebSocket Server for live reloading
 */

const socketServer = http.Server(app);
const websocket = socketio(socketServer);

socketServer.listen(4000, () => console.log('[Socket Server] : listening on port 4000'));

const clients = {};

// Handle socket connection & events
websocket.on('connection', (socket) => {
  console.log('[Socket Server] : user logged in');
  clients[socket.id] = socket;

  // Rooms are created when at least one user joins a playlist, the events are sent by room.
  // Joining room
  socket.on('userJoined', (playlistId) => {
    console.log(`[Socket Server] : user joined playlist ${playlistId}`);
    socket.join(playlistId);
  });

  // Refresh signal sent on addMusic, deleteMusic & voteMusic
  socket.on('addMusic', (playlistId) => websocket.to(playlistId).emit('refresh'));
  socket.on('deleteMusic', (playlistId) => websocket.to(playlistId).emit('refresh'));
  socket.on('voteMusic', (playlistId) => websocket.to(playlistId).emit('refresh'));

  // Leaving room ( pas le salon hein )
  socket.on('userLeaved', (playlistId) => {
    console.log(`[Socket Server] : user leaved playlist ${playlistId}`);
    socket.leave(playlistId);
  });
});

// Handle socket disconnection
websocket.on('disconnect', () => { console.log('[Socket Server] : user logged Out '); });

/**
 *          Core Express Server
 */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/tracks', express.static('downloads'));

/**
 *          Request logger Middleware
 */

const dateOptions = {
  year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
};

const requestLogger = require('./middlewares/requestLogger')(dateOptions);

app.use(requestLogger);

app.use('/api', API);

/**
 *        Clean all datas in DB
 */
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
  app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}!`));
});

/**
 *          Init the database with datas
 */

const generateRandomNumber = () => {
  const randomNumber = Math.floor(Math.random() * 1000) + 1;
  return randomNumber;
};

const generatePrivateId = () => {
  let i = 0;
  let MyId = '';
  while (i < 4) {
    MyId = `${MyId}${generateRandomNumber()}`;
    i += 1;
  }
  return MyId;
};

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
  const user2 = new models.User({
    login: 'b',
    password: hashy,
    name: 'Leo',
    familyName: 'Renoi',
    email: 'a.b@protonmail.com',
    isVerified: true,
  });
  const user3 = new models.User({
    login: 'c',
    password: hashy,
    name: 'Boris',
    familyName: 'Renoi',
    email: 'a.c@protonmail.com',
    isVerified: true,
  });
  const user4 = new models.User({
    login: 'd',
    password: hashy,
    name: 'Billy',
    familyName: 'Renoi',
    email: 'a.d@protonmail.com',
    isVerified: true,
  });
  await admin.save();
  await user1.save();
  await user2.save();
  await user3.save();
  await user4.save();

  for (let i = 0; i < 5; i += 1) {
    if (i > 2) { roomType = 'radio'; }
    let playlist;
    if (i === 0) {
      playlist = new models.Playlist({
        name: `${i} - boz`,
        users: [user1, user2],
        author: admin._id,
        authorName: admin.name,
        delegatedPlayerAdmin: admin._id,
        roomType,
        publicFlag: true,
        admins: [user2],
        bans: [],
        privateId: '1234',
        editRestriction: 'ADMIN_RESTRICTED',
      });
    } else {
      playlist = new models.Playlist({
        name: `${i} - AweSome Playlist of heaven before the rise of Jesus and after the death of all haflings in Middle-Earth`,
        users: [admin, user3],
        author: admin._id,
        authorName: admin.name,
        delegatedPlayerAdmin: admin._id,
        roomType,
        publicFlag: false,
        admins: [admin, user3],
        privateId: generatePrivateId(),
      });
    }
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
      votes: 1,
    });
    music2.save();
    const vote1 = new models.Vote({
      value: 1,
      user: user1._id,
      music: music1._id,
      playlist: playlist._id,
    });
    playlist.musics.splice(0, 0, music1._id);
    playlist.musics.splice(1, 0, music2._id);
    playlist.save();
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
