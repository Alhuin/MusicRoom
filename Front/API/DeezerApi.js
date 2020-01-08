import CustomError from './errorHandler';


const endpoint = 'https://api.deezer.com';

function getArtists(text) {
  const url = `${endpoint}search/artist?q=${text}`;
  return fetch(url)
    .then(async (response) => {
      const data = await response.json();
      return data.data;
    })
    .catch(error => console.error(error));
}

function getTracks(text) {
  return new Promise((resolve, reject) => {
    const url = `${endpoint}/search/track?q=${text}`;
    return fetch(url)
      .then(async (response) => {
        const data = await response.json();
        resolve(data.data);
      })
      .catch((error) => {
        console.error(error);
        reject(new CustomError('GetTracks', error.msg, error.status));
      });
  });
}


function getDeezerToken(DeezerCode) {
  return new Promise((resolve, reject) => {
    const urlDeez = 'https://connect.deezer.com/oauth/access_token.php?app_id=385364&secret=962dd8b93de97d66863149c48ee79598&code=';
    if (DeezerCode !== undefined) {
      fetch(urlDeez + DeezerCode, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'text/plain',
        },
      })
        .then(async (response) => {
          const data = await response.text();
          resolve(data);
        })
        .catch((error) => {
          reject(error);
          console.error(error);
        });
    }
  });
}


export {
  getTracks,
  getArtists,
  getDeezerToken,
};
