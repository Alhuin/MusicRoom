import PlaylistModel from '../models/playlistModel'

function getPlaylists() {

    return new Promise((resolve, reject) => {

        PlaylistModel.find({}, (error, playlists) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else if (!playlists.length) {
                reject({
                    status: 401,
                    msg: 'No Playlists in Database'
                })
            }
            else {
                resolve({
                    status: 200,
                    data: playlists,
                })
            }
        });
    });
}

function getPlaylistById(playlistId) {

    return new Promise((resolve, reject) => {

        PlaylistModel.findById(playlistId, (error, playlist) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else if (!playlist) {
                reject({
                    status: 401,
                    msg: 'No Playlist with this id in Database'
                })
            }
            else {
                resolve({
                    status: 200,
                    data: playlist,
                })
            }
        });
    });
}

function deletePlaylistById(playlistId) {

    return new Promise((resolve, reject) => {

        PlaylistModel.findById(playlistId, (error, playlist) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else if (!playlist) {
                reject({
                    status: 401,
                    msg: 'No Playlist with this id in Database'
                })
                
            }
            else {
                playlist.remove((error, playlist) => {
                    if (error) {
                        reject({
                            status: 500,
                            msg: error.msg,
                        })
                    }
                    else {
                        resolve({
                            status: 200,
                            data: playlist,
                        })
                    }
                })
            }
        });
    });
}

export default {
    getPlaylists,
    getPlaylistById,
    deletePlaylistById,
}