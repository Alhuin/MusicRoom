import CustomError from './errorHandler';

const server = 'http://10.3.1.3:3000/api';

export function login(userName, password) {
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
        if (response.status === 200) {
          resolve({
            status: 200,
            data: data.data,
          });
        } else {
          reject(new CustomError(data.msg, data.status));
        }
      })
      .catch((error) => {
        reject(new CustomError(error.msg, error.status));
      });
  });
}

export function addUser(userName, password, name, familyName, email) {
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
        alert(data.msg);
      } else {
        alert(`error ${data.status}: ${data.msg}`);
      }
      // console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function sendEmailToken(loginOrEmail) {
  fetch(`${server}/users/emailToken/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ loginOrEmail }),
  })
    .then(async (response) => {
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        alert('An email has been sent');
      } else {
        alert(`error ${data.status}: ${data.msg}`);
      }
      // console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function sendPasswordToken(loginOrEmail) {
  fetch(`${server}/users/passToken/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ loginOrEmail }),
  })
    .then(async (response) => {
      console.log(response);
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        alert('An email has been sent');
      } else {
        alert(`error ${data.status}: ${data.msg}`);
      }
      // console.log(data);
    })
    .catch((error) => {
      console.log(error);
      console.error(error);
    });
}

export function getPlaylists() {
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
          resolve({
            status: 200,
            data,
          });
        } else if (response.status === 404) {
          reject(new CustomError('Page Not Found', 404));
        } else {
          reject(new CustomError(data.msg, data.status));
          // alert(`error ${data.status}: ${data.msg}`);
        }
      })
      .catch((error) => {
        console.log('error');
        console.log(error);
        reject(new CustomError(error.msg, error.status));
        // console.error(error);
      });
  });
}
