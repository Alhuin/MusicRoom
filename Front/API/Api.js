const server = 'http://1d71db7f.ngrok.io';

export function login(userName, password) {
  fetch(`${server}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName, password }),
  })
    .then(async (response) => {
      // console.log(response.status);
      const data = await response.json();
      if (response.status === 200) {
        alert(`Login OK for user ${data.name} ${data.familyName}`);
      } else if (response.status === 400) {
        alert(`error : ${data.error}`);
      } else {
        alert('Server Error');
      }
      return data;
    })
    .then(responseData => console.log(responseData))
    .catch((error) => {
      console.error(error.msg);
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
      userName, password, name, familyName, email,
    }),
  })
    .then(async (response) => {
      const data = await response.json();
      if (response.status === 200) {
        alert(data.msg);
      } else {
        alert('Server Error');
      }
      return data;
    })
    .then(responseData => console.log(responseData))
    .catch((error) => {
      console.error(error.msg);
    });
}

export function sendEmailToken(loginOrEMail) {

    fetch(server + '/api/users/emailToken/', {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({loginOrEMail}),
    })
        .then(async (response) => {
            let data = await response.json();
            if (response.status === 200) {
                alert("An email has been sent");
            }
            else {
                alert('Server Error');
            }
            return data;
        })
        .then((responseData) => console.log(responseData))
        .catch((error) => {
            console.error(error.msg);
        })
}