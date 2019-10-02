import CustomError from './errorHandler';

const server = 'http://10.3.1.3:3000/api';

/*
                    Users & Login
 */

// Dans le catch du fetch on reject(error) car on connait pas son objet d'erreur => a tester

function login(userName, password) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: userName, password,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        // console.log('login response from fetch');
        // console.log(response);
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('LoginError', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function getUserById(userId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/users/${userId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        // console.log('GetUserById reponse from fetch');
        // console.log(response);
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else if (response.status === 404) {
          reject(new CustomError('GetUser', data.msg, 404));
        }
      })
      .catch(error => reject(error));
  });
}

function addUser(userName, password, name, familyName, email) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: userName, password, name, familyName, email,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
          // alert(data.msg);
        } else {
          reject(new CustomError('AddUser', data.msg, response.status));
          // alert(`error ${data.status}: ${data.msg}`);
        }
      })
      .catch((error) => reject(error));
  });
}
//
// function sendEmailToken(loginOrEmail) {
//   return new Promise((resolve, reject) => {
//     fetch(`${server}/users/emailToken/`, {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json, text/plain, */*',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ loginOrEmail }),
//     })
//       .then(async (response) => {
//         const data = await response.json();
//         if (response.status === 200) {
//           resolve(data);
//           // alert('An email has been sent');
//         } else {
//           reject(new CustomError('EmailToken', data.msg, response.status));
//           // alert(`error ${data.status}: ${data.msg}`);
//         }
//       })
//       .catch((error) => {
//         reject(error);
//         // console.error(error);
//       });
//   });
// }

function sendPasswordToken(loginOrEmail) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/users/passToken/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loginOrEmail }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
          // alert('An email has been sent');
        } else {
          reject(new CustomError('PasswordToken', data.msg, response.status));
          // alert(`error ${data.status}: ${data.msg}`);
        }
      })
      .catch(error => reject(error));
  });
}

function updatePassword(userId, password) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/users/newPass/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('UpdatePassword', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

/*
                      Musics, Playlists & Votes
 */


function getPlaylists() {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          // alert('GetAllPlaylists is success');
          resolve(data);
        } else {
          reject(new CustomError('GetPlaylists', data.msg, response.status));
          // alert(`error ${data.status}: ${data.msg}`);
        }
      })
      .catch(error => reject(error));
  });
}

function getPlaylistsFilteredByRoom(roomType) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/${roomType}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('PlaylistsFilteredByRoom', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function getPlaylistsFiltered(roomType, userId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/filtered`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomType, userId,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('PlaylistsFiltered', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function getPlaylistById(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/${playlistId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('PlaylistsById', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function getMusicsByVoteInPlaylist(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/musicsByVote/${playlistId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('MusicsByVote', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function voteMusic(userId, musicId, playlistId, value) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/voteMusic`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId, musicId, playlistId, value,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('VoteMusic', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function getMyVotesInPlaylist(userId, playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/votes/playlist`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId, playlistId,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('GetMyVoteInPlaylist', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function addMusicToPlaylist(playlistId, userId, title, artist, album, albumCover, preview, link) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/musics/add`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlistId, userId, title, artist, album, albumCover, preview, link,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('addMusic', data.msg, response.status));
          // console.log(data.msg);
        }
      })
      .catch(error => reject(error));
  });
}

function addPlaylist(name, publicFlag, userId, author, authorName, roomType, date, dateTwo, location, privateId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/add`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name, publicFlag, userId, author, authorName, roomType, date, dateTwo, location, privateId,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('AddPlaylist', data.msg, response.status));
          // console.log(data.msg);
        }
      })
      .catch(error => reject(error));
  });
}

function joinRoom(userId, playlistCode) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/join`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId, playlistCode,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('JoinRoom', data.msg, response.status));
          // console.log(data.msg);
        }
      })
      .catch(error => reject(error));
  });
}

function isAdmin(userId, playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/isAdmin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId, playlistId,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('isAdmin', data.msg, response.status));
          // console.log(data.msg);
        }
      })
      .catch(error => reject(error));
  });
}

function getAdminsByPlaylistId(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/admins/${playlistId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('getAdmins', data.msg, response.status));
          // console.log(data.msg);
        }
      })
      .catch(error => reject(error));
  });
}

function getUsersByPlaylistId(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/users/${playlistId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('UsersByPlaylist', data.msg, response.status));
          // console.log(data.msg);
        }
      })
      .catch(error => reject(error));
  });
}

function getBansByPlaylistId(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/bans/${playlistId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('getBans', data.msg, response.status));
          // console.log(data.msg);
        }
      })
      .catch(error => reject(error));
  });
}

function adminInPlaylistDowngrade(playlistId, userId, requesterId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/admins/downgrade`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlistId, userId, requesterId,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('AdminDowngrade', data.msg, response.status));
          // console.log(data.msg);
        }
      })
      .catch(error => reject(error));
  });
}

function userInPlaylistUpgrade(playlistId, userId, requesterId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/users/upgrade`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlistId, userId, requesterId,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('UserUpgrade', data.msg, response.status));
          // console.log(data.msg);
        }
      })
      .catch(error => reject(error));
  });
}

function BanUserInPlaylist(playlistId, userId, isItAdmin, requesterId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/users/ban`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlistId, userId, isItAdmin, requesterId,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('BanUser', data.msg, response.status));
          // console.log(data.msg);
        }
      })
      .catch(error => reject(error));
  });
}

function DeleteUserInPlaylist(playlistId, userId, isItAdmin, requesterId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/users/delete`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlistId, userId, isItAdmin, requesterId,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('DeleteUserInPlaylist', data.msg, response.status));
          // console.log(data.msg);
        }
      })
      .catch(error => reject(error));
  });
}

function getPublicityOfPlaylistById(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/publicity/${playlistId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('PlaylistIsPlublic', data.msg, response.status));
          // console.log(data.msg);
        }
      })
      .catch(error => reject(error));
  });
}

function addUserToPlaylistAndUnbanned(playlistId, userId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/user/unbanned`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, playlistId }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('UpdatePassword', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

/*
                    Track Player
 */

function getNextTrack(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${server}/playlists/nextTrack/${playlistId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('GetNextTrack', data.msg, response.status));
          // console.log(data.msg);
        }
      })
      .catch(error => reject(error));
  });
}
export {
  login,
  addUser,
  // sendEmailToken,
  sendPasswordToken,
  updatePassword,
  getPlaylists,
  getPlaylistsFilteredByRoom,
  getPlaylistsFiltered,
  getMusicsByVoteInPlaylist,
  // getPlaylistById,
  getUserById,
  voteMusic,
  addMusicToPlaylist,
  addPlaylist,
  joinRoom,
  isAdmin,
  getAdminsByPlaylistId,
  getUsersByPlaylistId,
  getBansByPlaylistId,
  adminInPlaylistDowngrade,
  userInPlaylistUpgrade,
  BanUserInPlaylist,
  DeleteUserInPlaylist,
  getPublicityOfPlaylistById,
  getNextTrack,
  addUserToPlaylistAndUnbanned,
  getMyVotesInPlaylist,
};
