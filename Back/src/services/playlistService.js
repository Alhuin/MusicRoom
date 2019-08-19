import PlaylistModel from '../models/playlistModel';
import CustomError from './errorHandler';
import models from '../models';

function getPlaylists() {
  return new Promise((resolve, reject) => {
    PlaylistModel.find({}, (error, playlists) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!playlists.length) {
        reject(new CustomError('No playlists in database', 400));
      } else {
        resolve({
          status: 200,
          data: playlists,
        });
      }
    });
  });
}

function getPlaylistById(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!playlist) {
        reject(new CustomError('No playlist with this id in database', 400));
      } else {
        resolve({
          status: 200,
          data: playlist,
        });
      }
    });
  });
}

function addPlaylist(name, publicFlag, userId) {
  return new Promise((resolve, reject) => {
    const playlist = new models.Playlist({
      name,
      publicFlag,
      users: [userId],
      allowVotes: true,
      // à voir si on laisse cet allowVotes ici,
      // ou bien dans un potentiel schema partyRoom qui le contiendrait
    });
    playlist.save((saveError, savedPlaylist) => {
      if (saveError) {
        reject(new CustomError(saveError, 500));
      } else {
        resolve({
          status: 200,
          data: savedPlaylist,
        });
      }
    });
  });
}

function deletePlaylistById(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.findById(playlistId, (error, playlist) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!playlist) {
        reject(new CustomError('No playlist with this id in database', 400));
      } else {
        playlist.remove((removeError, removedPlaylist) => {
          if (removeError) {
            reject(new CustomError(removeError, 500));
          } else {
            resolve({
              status: 200,
              data: removedPlaylist,
            });
          }
        });
      }
    });
  });
}

export default {
  getPlaylists,
  getPlaylistById,
  addPlaylist,
  deletePlaylistById,
};
