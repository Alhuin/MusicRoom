import { SERVER, EXPRESS_PORT } from 'react-native-dotenv';
import CustomError from './errorHandler';

const api = `${SERVER}:${EXPRESS_PORT}/api`;

/*
                    Users & Login
 */

function login(userName, password) {
  return new Promise((resolve, reject) => fetch(
    `${api}/login`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: userName,
        password,
      }),
    },
  ).then(async (response) => {
    const data = await response.json();
    if (response.status === 200) {
      resolve(data);
    } else {
      reject(new CustomError('LoginError', data.msg, response.status));
    }
  }).catch(error => reject(error)));
}

function getUserByIdByPreferences(userId, requesterId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/users/getByPreferences/${userId}&${requesterId}`, {
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
        } else if (response.status === 404) {
          reject(new CustomError('GetUser', data.msg, 404));
        }
      })
      .catch(error => reject(error));
  });
}

function addUser(userName, password, name, familyName, email, idDeezer, idGoogle) {
  return new Promise((resolve, reject) => {
    let body = {
      login: userName, password, name, familyName, email,
    };
    if (idDeezer) {
      body = { ...body, ...idDeezer };
    }
    if (idGoogle) {
      body = { ...body, ...idGoogle };
    }
    fetch(`${api}/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200 || response.status === 202) {
          resolve(data);
        } else if (response.status === 400) {
          reject(new CustomError('AddUser', data.msg, 400));
        }
      })
      .catch(error => reject(error));
  });
}

function sendEmailToken(loginOrEmail) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/users/emailToken/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loginOrEmail }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200 || response.status === 202) {
          resolve(data);
          // alert('An email has been sent');
        } else {
          reject(new CustomError('EmailToken', data.msg, response.status));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function sendPasswordToken(loginOrEmail) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/users/passToken/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loginOrEmail }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200 || response.status === 202) {
          resolve(data);
        } else {
          reject(new CustomError('PasswordToken', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function updateUser(userId, newLogin, name, familyName,
  email, phoneNumber, preferences, visibilityTable, idDeezer, idGoogle) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/users/update`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        newLogin,
        name,
        familyName,
        email,
        phoneNumber,
        preferences,
        visibilityTable,
        idDeezer,
        idGoogle,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('updateUser', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function updatePassword(userId, password) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/users/newPass/`, {
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

function addFriend(friendId, userId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/users/addFriend`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendId, userId }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('addFriend', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function deleteFriend(friendId, userId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/users/deleteFriend`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendId, userId }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('deleteFriend', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function getFriends(userId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/users/getFriends/${userId}`, {
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
          reject(new CustomError('getFriends', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

/*
                      Musics, Playlists & Votes
 */

function getPlaylistsFiltered(roomType, userId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/filtered`, {
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


function getPlaylistName(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/name/${playlistId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        /* this whole playlist is received */
        const data = await response.json();
        if (response.status === 200) {
          resolve(data.name);
        } else if (response.status === 404) {
          reject(new CustomError('GetPlaylistName', data.msg, 404));
        }
      })
      .catch(error => reject(error));
  });
}

function getMusicsByVote(playlistId, roomType) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/musicsByVote/${playlistId}&${roomType}`, {
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

function voteMusic(userId, musicId, playlistId, value, pos) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/voteMusic`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId, musicId, playlistId, value, pos,
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
    fetch(`${api}/votes/playlist`, {
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
    fetch(`${api}/musics/add`, {
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

function addPlaylist(name, publicFlag, userId, author, authorName,
  delegatedPlayerAdmin, roomType, startDate, endDate, location, privateId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/add`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        publicFlag,
        userId,
        author,
        authorName,
        delegatedPlayerAdmin,
        roomType,
        startDate,
        endDate,
        location,
        privateId,
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

function joinPlaylistWithCode(userId, playlistCode) {
  return new Promise((resolve, reject) => fetch(
    `${api}/playlists/joinPlaylistWithCode`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId, playlistCode,
      }),
    },
  ).then(async (response) => {
    const data = await response.json();
    if (response.status === 200) {
      resolve(data);
    } else {
      reject(new CustomError('joinPlaylistWithCode', data.msg, response.status));
    }
  }).catch(error => reject(error)));
}

function joinPlaylistWithId(userId, playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/joinPlaylistWithId`, {
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
          reject(new CustomError('joinPlaylistWithId', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function isAdmin(userId, playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/isAdmin`, {
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
        }
      })
      .catch(error => reject(error));
  });
}

function getAdminsByPlaylistId(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/admins/${playlistId}`, {
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
        }
      })
      .catch(error => reject(error));
  });
}

function getUsersByPlaylistId(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/users/${playlistId}`, {
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
        }
      })
      .catch(error => reject(error));
  });
}

function getBansByPlaylistId(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/bans/${playlistId}`, {
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
        }
      })
      .catch(error => reject(error));
  });
}

function adminInPlaylistDowngrade(playlistId, userId, requesterId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/admins/downgrade`, {
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
        }
      })
      .catch(error => reject(error));
  });
}

function userInPlaylistUpgrade(playlistId, userId, requesterId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/users/upgrade`, {
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
        }
      })
      .catch(error => reject(error));
  });
}

function banUserInPlaylist(playlistId, userId, isItAdmin, requesterId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/users/ban`, {
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
        }
      })
      .catch(error => reject(error));
  });
}

function deleteUserInPlaylist(playlistId, userId, isItAdmin, requesterId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/users/delete`, {
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
          reject(new CustomError('deleteUserInPlaylist', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function getPublicityOfPlaylistById(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/publicity/${playlistId}`, {
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
        }
      })
      .catch(error => reject(error));
  });
}

function getPlaylistPrivateId(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/privateId/${playlistId}`, {
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
          reject(new CustomError('getPlaylistPrivateId', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function getDelegatedPlayerAdmin(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/delegatedPlayerAdmin/${playlistId}`, {
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
          reject(new CustomError('delegatedPlayerAdmin', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function addUserToPlaylistAndUnbanned(playlistId, userId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/user/unbanned`, {
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
          reject(new CustomError('addUserToPlaylistAndUnbanned', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function setPublicityOfPlaylist(playlistId, value) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/setPublicity`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlistId, value }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('setPublicityOfPlaylist', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function setDelegatedPlayerAdmin(playlistId, userId, requesterId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/setDelegatedPlayerAdmin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlistId, userId, requesterId }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('setPublicityOfPlaylist', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function moveTrackOrder(playlistId, musicId, newIndex) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/moveTrackOrder`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlistId, musicId, newIndex }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('moveTrackOrder', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function getPlaylistDates(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/dates/${playlistId}`, {
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
          reject(new CustomError('getPlaylistDates', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function getPlaylistLocation(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/location/${playlistId}`, {
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
          reject(new CustomError('getPlaylistLocation', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function setPlaylistLocation(playlistId, newLocation, userId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/setPlaylistLocation`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlistId, newLocation, userId }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data.location);
        } else {
          reject(new CustomError('setPlaylistLocation', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function getTags(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/getTags/${playlistId}`, {
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
          reject(new CustomError('getTags', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function getEditRestriction(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/getEditRestriction/${playlistId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data[0]);
        } else {
          reject(new CustomError('getEditRestriction', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function setTags(playlistId, newTags) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/setTags`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlistId, newTags }),
    })
      .then(async (response) => {
        let data = await response.json();
        data = data.tags;
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('setTags', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function setStartDate(playlistId, newDate) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/setStartDate`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlistId, newDate }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('setStartDate', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function setEndDate(playlistId, newDate) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/setEndDate`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlistId, newDate }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('setEndDate', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function setEditRestriction(playlistId, newEditRestriction) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/setEditRestriction`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlistId, newEditRestriction }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('setEditRestriction', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function isEditor(playlistId, userId, pos) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/isEditor`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlistId, userId, pos }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('isEditor', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function deletePlaylistByAdmin(playlistId, userId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/deletePlaylistById`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlistId, userId }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('deletePlaylistByAdmin', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function setPlaylistName(playlistId, userId, newName) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/setPlaylistName`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlistId, userId, newName }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('setPlaylistName', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

/*
                    Track Player
 */

function getNextTrackByVote(playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/nextTrack/${playlistId}`, {
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
          reject(new CustomError('getNextTrackByVote', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function deleteTrackFromPlaylist(musicId, playlistId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/deleteTrack`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ musicId, playlistId }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('RemoveTrackFromPlaylist', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function deleteTrackFromPlaylistRight(musicId, playlistId, userId) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/playlists/deleteTrackRight`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ musicId, playlistId, userId }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
        } else {
          reject(new CustomError('RemoveTrackFromPlaylist', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}

function findUserByidSocial(DeezerId, SocialType) {
  return new Promise((resolve, reject) => {
    fetch(`${api}/users/findDeezer/${DeezerId}&${SocialType}`, {
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
          reject(new CustomError('findUserByidSocial', data.msg, response.status));
        }
      })
      .catch(error => reject(error));
  });
}


export {
  login,
  addUser,
  updateUser,
  sendEmailToken,
  sendPasswordToken,
  updatePassword,
  getPlaylistsFiltered,
  getMusicsByVote,
  getUserByIdByPreferences,
  voteMusic,
  addMusicToPlaylist,
  addPlaylist,
  joinPlaylistWithCode,
  joinPlaylistWithId,
  isAdmin,
  getAdminsByPlaylistId,
  getUsersByPlaylistId,
  getBansByPlaylistId,
  adminInPlaylistDowngrade,
  userInPlaylistUpgrade,
  banUserInPlaylist,
  deleteUserInPlaylist,
  getPublicityOfPlaylistById,
  getNextTrackByVote,
  addUserToPlaylistAndUnbanned,
  getMyVotesInPlaylist,
  getPlaylistPrivateId,
  getDelegatedPlayerAdmin,
  setPublicityOfPlaylist,
  setDelegatedPlayerAdmin,
  deleteTrackFromPlaylist,
  moveTrackOrder,
  getPlaylistDates,
  setStartDate,
  setEndDate,
  getTags,
  setTags,
  getEditRestriction,
  setEditRestriction,
  isEditor,
  deletePlaylistByAdmin,
  addFriend,
  deleteFriend,
  getFriends,
  getPlaylistLocation,
  setPlaylistLocation,
  setPlaylistName,
  getPlaylistName,
  findUserByidSocial,
  deleteTrackFromPlaylistRight,
};
