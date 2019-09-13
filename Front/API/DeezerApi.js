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

export {
  getTracks,
  getArtists,
};
