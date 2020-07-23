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

const server = http.Server(app);
const io = socketio(server);
const clients = [];

/**     Handle socket connection & events     */

io.on('connection', (socket) => {
  const { id } = socket.client;
  let i = 0;

  // Disconnect client if someone is already logged with this account
  for (i; i < clients.length; i += 1) {
    if (String(clients[i].handshake.query.userId) === String(socket.handshake.query.userId)) {
      console.log(`[Socket Server] : user to delog is ${id}`);
      clients[i].to(id).emit('delog');
      break;
    }
  }
  console.log(`[Socket Server] : user is ${id} logged in`);
  clients.push(socket);

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
  socket.on('addRadio', () => {
    console.log('[SocketServer] : Radio added, Emitting refresh for radiosList');
    io.sockets.in('radiosList').emit('refresh');
  });

  // Adding a party
  socket.on('addParty', () => {
    console.log('[Socket Server] : Party added, Emitting refresh for partyList');
    io.sockets.in('partysList').emit('refresh');
  });

  // Removing a party
  socket.on('removeParty', () => {
    console.log('[Socket Server] : Party deleted, Emitting refresh for radiosList');
    io.sockets.in('partysList').emit('refresh');
  });

  // Removing a radio
  socket.on('removeRadio', () => {
    console.log('[Socket Server] : Radio removed, Emitting refresh for radiosList');
    io.sockets.in('radiosList').emit('refresh');
  });

  // Refresh signal sent to a specific playlist on addMusic, deleteMusic & voteMusic
  socket.on('addMusic', (playlistId) => {
    console.log(`[Socket Server] : music added, Emitting refresh for playlist ${playlistId}`);
    io.sockets.in(playlistId).emit('refresh');
  });

  // Deleting a music
  socket.on('deleteMusic', (playlistId, trackId, nextIndex) => {
    console.log(`[Socket Server] : music deleted, Emitting refresh for playlist ${playlistId}`);
    io.sockets.in(playlistId).emit('refresh');
    io.sockets.in(playlistId).emit('deleted', trackId, nextIndex);
  });

  // Changing a music
  socket.on('musicChanged', (playlistId) => {
    console.log(`[Socket Server] : music changed, Emitting refresh for playlist ${playlistId}`);
    io.sockets.in(playlistId).emit('refresh');
  });

  // Reordered musics in a radio
  socket.on('musicMoved', (playlistId) => {
    console.log(`[Socket Server] : music moved, Emitting refresh for playlist ${playlistId}`);
    io.sockets.in(playlistId).emit('refresh');
  });

  // Voted for a music in a party
  socket.on('voteMusic', (playlistId) => {
    console.log(`[Socket Server] : music voted, Emitting refresh for playlist ${playlistId}`);
    io.sockets.in(playlistId).emit('refresh');
  });

  // User with playing rights changed in a party
  socket.on('delegatedParameterChanged', (playlistId, userId) => {
    for (i; i < clients.length; i += 1) {
      if (String(clients[i].handshake.query.userId) === String(userId)) {
        console.log(`[Socket Server] : delegated parameters changed. Emitting refreshPermissions for playlist ${playlistId} and user ${userId} `);
        io.sockets.in(playlistId).to(clients[i].client).emit('refreshDelegatedPermissions');
        break;
      }
    }
  });

  // Modified admin rights
  socket.on('personalParameterChanged', (playlistId, userId) => {
    for (i; i < clients.length; i += 1) {
      if (String(clients[i].handshake.query.userId) === String(userId)) {
        console.log(`[Socket Server] : personal parameters changed. Emitting refreshPermissions for playlist ${playlistId} and user ${userId} `);
        io.sockets.in(playlistId).to(clients[i].client).emit('refreshPermissions');
        break;
      }
    }
  });

  // User banned or kicked from playlist
  socket.on('kickOrBanFromPlaylist', (playlistId, userId) => {
    for (i; i < clients.length; i += 1) {
      if (String(clients[i].handshake.query.userId) === String(userId)) {
        console.log(`[Socket Server] : kick from playlist. Emitting kick for playlist ${playlistId} and user ${userId} `);
        io.sockets.in(playlistId).to(clients[i].client).emit('kick');
        break;
      }
    }
  });

  // Playlist parameters changed
  socket.on('parameterChanged', (playlistId) => {
    console.log(`[Socket Server] : parameters changed. Emitting refreshPermissions for playlist ${playlistId}`);
    io.sockets.in(playlistId).emit('refreshPermissions');
  });

  // Playlist end reached
  socket.on('playlistEnd', (playlistId) => {
    console.log(`end playlist ${playlistId}`);
    io.sockets.in(playlistId).emit('playlistEnd');
  });

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

  // Handle socket disconnection
  socket.on('disconnect', () => {
    const index = clients.indexOf(socket);
    clients.splice(index, 1);
    console.log('[Socket Server] : user logged Out ');
  });
});


server.listen(process.env.WEBSOCKET_PORT, () => console.log(`[Socket Server] : listening on port ${process.env.WEBSOCKET_PORT} at ${process.env.SERVER}`));

/**
 *          Core Express Server
 */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/tracks', express.static('downloads'));

/**         Request logger Middleware       */

const dateOptions = {
  year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
};

const requestLogger = require('./middlewares/requestLogger')(dateOptions);

app.use(requestLogger);

app.use('/api', API);

/**       Clean all datas in DB             */

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

  app.listen(process.env.EXPRESS_PORT, () => console.log(`App listening on port ${process.env.EXPRESS_PORT}!`));
});
