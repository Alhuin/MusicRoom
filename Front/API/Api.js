const server = "http://10.2.6.4:3000";

export function login(login, password) {

    // console.log('login: ' + login + ', password: ' + password);
    fetch(server + '/api/login', {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({login, password}),
    })
        .then(async (response) => {
            // console.log(response.status);
            let data = await response.json();
            // console.log(data);
            if (response.status === 200) {
                alert("Login OK for user " + data.name + " " + data.familyName);
            }
            else if (response.status === 400 || response.status === 401){
                // console.log(data);
                alert("error : " + data.msg);
            }
            else {
                alert('Server Error');
            }
            return data;
        })
        .then((responseData) => console.log(responseData))
        .catch((error) => {
            // console.log('catch front');
            console.error(error.msg);
        })
}

export function addUser(login, password, name, familyName, email) {

    // console.log('in addUser');
    // console.log('POST on ' + server + '/users');
    fetch(server + '/api/users', {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({login, password, name, familyName, email}),
    })
        .then(async (response) => {
            let data = await response.json();
            if (response.status === 200) {
                alert(data.msg);
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

export function findUserByLoginOrEmail(login) {

    fetch(server + '/api/users', {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({login}),
    })
        .then(async (response) => {
            let data = await response.json();
            if (response.status === 200) {
                alert("An email has been send");
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