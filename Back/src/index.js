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

socketServer.listen(process.env.WEBSOCKET_PORT, () => console.log(`[Socket Server] : listening on port ${process.env.WEBSOCKET_PORT} at ${process.env.SERVER}`));

const clients = {};

// Handle socket connection & events
websocket.on('connection', (socket) => {
  console.log('[Socket Server] : user logged in');
  clients[socket.id] = socket;


  // Joining radiosList room
  socket.on('userJoinedRadiosList', () => {
    console.log('[Socket Server] : user joined radiosList');
    socket.join('radiosList');
  });

  // Joining partysList room
  socket.on('userJoinedPartysList', () => {
    console.log('[Socket Server] : user joined partysList');
    socket.join('partysList');
  });

  // Joining a playlist room
  socket.on('userJoinedPlaylist', (playlistId) => {
    console.log(`[Socket Server] : user joined playlist ${playlistId}`);
    socket.join(playlistId);
  });

  // Refresh signal sent to PlaylistList on removePlaylist & addPlaylsit
  socket.on('addRadio', () => websocket.to('radiosList').emit('refresh'));
  socket.on('addParty', () => websocket.to('partysList').emit('refresh'));
  socket.on('removeParty', () => websocket.to('partysList').emit('refresh'));
  socket.on('removeRadio', () => websocket.to('radiosList').emit('refresh'));

  // Refresh signal sent to a specific playlist on addMusic, deleteMusic & voteMusic
  socket.on('addMusic', (playlistId) => websocket.to(playlistId).emit('refresh'));
  socket.on('deleteMusic', (playlistId) => websocket.to(playlistId).emit('refresh'));
  socket.on('voteMusic', (playlistId) => websocket.to(playlistId).emit('refresh'));
  socket.on('parameterChanged', (playlistId) => websocket.to(playlistId).emit('refreshPermissions'));

  // Leaving Playlist room
  socket.on('userLeavedPlaylist', (playlistId) => {
    console.log(`[Socket Server] : user leaved playlist ${playlistId}`);
    socket.leave(playlistId);
  });

  // Leaving radiosList room
  socket.on('userLeavedRadiosList', () => {
    console.log('[Socket Server] : user leaved radiosList');
    socket.leave('radiosList');
  });

  // Leaving partysList room
  socket.on('userLeavedPartysList', () => {
    console.log('[Socket Server] : user leaved partysList');
    socket.leave('partysList');
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
  app.listen(process.env.EXPRESS_PORT, () => console.log(`App listening on port ${process.env.EXPRESS_PORT}!`));
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
    phoneNumber: '00',
  });
  const salty = await bcrypt.genSaltSync(10);
  const hashy = await bcrypt.hashSync('a', salty);
  const user2 = new models.User({
    login: 'b',
    password: hashy,
    name: 'Leo',
    familyName: 'Renoi',
    email: 'a.b@protonmail.com',
    isVerified: true,
    phoneNumber: '02',
  });
  const user3 = new models.User({
    login: 'c',
    password: hashy,
    name: 'Boris',
    familyName: 'Renoi',
    email: 'a.c@protonmail.com',
    isVerified: true,
    phoneNumber: '03',
  });
  const user4 = new models.User({
    login: 'd',
    password: hashy,
    name: 'Jean',
    familyName: 'Renoi',
    email: 'a.d@protonmail.com',
    isVerified: true,
    phoneNumber: '04',
  });
  const admin = new models.User({
    login: 'a',
    password: hashy,
    name: 'Julien',
    familyName: 'Janin-Reynaud',
    email: 'julien.janinr@protonmail.com',
    phoneNumber: '01',
    isVerified: true,
    friends: [user3],
  });
  user3.friends = [admin];
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
        users: [admin, user1, user2],
        author: admin._id,
        authorName: admin.name,
        delegatedPlayerAdmin: admin._id,
        roomType,
        publicFlag: true,
        admins: [admin],
        bans: [],
        privateId: '1234',
        editRestriction: 'EVENT_RESTRICTED',
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now() + 10000000000),
        location: {
          coords: {
            latitude: 45.73941704121705,
            longitude: 4.817631669272994,
          },
        },
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
