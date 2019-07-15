import PlaylistModel from '../models/playlistModel';
import CustomError from './errorHandler';

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
  deletePlaylistById,
};
