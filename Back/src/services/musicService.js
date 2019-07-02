import MusicModel from '../models/musicModel'

function getMusics() {

    return new Promise((resolve, reject) => {

        MusicModel.find({}, (error, musics) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else if (!musics.length) {
                reject({
                    status: 401,
                    msg: 'No Musics in Database'
                })
            }
            else {
                resolve({
                    status: 200,
                    data: musics,
                })
            }
        });
    });
}

function getMusicById(musicId) {

    return new Promise((resolve, reject) => {

        MusicModel.findById(musicId, (error, music) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else if (!music) {
                reject({
                    status: 401,
                    msg: 'No Music with this id in Database'
                })
            }
            else {
                resolve({
                    status: 200,
                    data: music,
                })
            }
        });
    });
}

function deleteMusicById(musicId) {

    return new Promise((resolve, reject) => {

        MusicModel.findById(musicId, (error, music) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else if (!music) {
                reject({
                    status: 401,
                    msg: 'No Music with this id in Database'
                })
            }
            else {
                music.remove((error, music) => {
                    if (error) {
                        reject({
                            status: 500,
                            msg: error.msg,
                        })
                    }
                    else {
                        resolve({
                            status: 200,
                            data: music,
                        })
                    }
                })
            }
        });
    });
}

export default {
    getMusics,
    getMusicById,
    deleteMusicById,
}