const server = "http://b2f06caf.ngrok.io";

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
            // console.log(response);
            let data = await response.json();
            if (response.status === 200) {
                alert("Login OK for user " + data.name + " " + data.familyName);
            }
            else if (response.status === 400 || response.status === 401){
                alert("error : "+ data.msg);
            }
            else {
                alert('Server Error');
            }
            return data;
        })
        .then((responseData) => console.log(responseData))
        .catch((error) => {
            // console.log('catch login front');
            console.error(error);
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
            else if (response.status === 400 || response.status === 401){
                alert("error : "+ data.msg);
            }
            else {
                alert('Server Error');
            }
            return data;
        })
        .then((responseData) => console.log(responseData))
        .catch((error) => {
            console.error(error);
        })
}