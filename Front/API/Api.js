const server = 'http://10.4.2.3:3000/api';

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
      // console.log(response.status);
      const data = await response.json();
      if (response.status === 200) {
        alert(`Login OK for user ${data.name} ${data.familyName}`);
      } else if (response.status === 400) {
        alert(`error : ${data.msg}`);
      } else if (response.status === 401) {
        alert(`error : ${data.msg}`);
      } else {
        alert('Server Error');
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
        alert('Server Error');
      }
      // console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function sendEmailToken(loginOrEmail) {
  fetch(`${server}/api/users/emailToken/`, {
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
        alert('Server Error');
      }
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function sendPasswordToken(loginOrEmail) {
    fetch(`${server}/api/users/emailToken/`, {
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
                alert('Server Error');
            }
            console.log(data);
        })
        .catch((error) => {
            console.error(error);
        });
}
