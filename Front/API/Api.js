const server = 'http://10.4.6.5:3000/api';

export function login(userName, password) {
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
        alert(`Login OK for user ${data.name} ${data.familyName}`);
      } else {
        alert(`error ${data.status}: ${data.msg}`);
      }
    })
    .catch((error) => {
      console.error(error);
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
      console.log(error);
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

export function getAllPlaylists() {
  return fetch(`${server}/playlists`, {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 200) {
        // alert('GetAllPlaylists is success');
      } else {
        // alert(`error ${response.status}: ${response.msg}`);
      }
      return response.json();
    })
    .then(res => res)
    .catch((error) => {
      console.log(error);
      console.error(error);
    });
}
