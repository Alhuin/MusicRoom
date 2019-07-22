const server = 'http://10.3.1.3:3000/api';

function login(userName, password) {
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

function addUser(userName, password, name, familyName, email) {
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

function sendEmailToken(loginOrEmail) {
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

function sendPasswordToken(loginOrEmail) {
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

function updatePassword(userId, password) {
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
      console.log(data);
      if (response.status === 200) {
        alert('Your password has been updated.');
      } else {
        alert(`error ${data.status}: ${data.msg}`);
      }
      // console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export {
  login,
  addUser,
  sendEmailToken,
  sendPasswordToken,
  updatePassword,
};
