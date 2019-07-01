const server = "http://3f4b1f3c.ngrok.io";

export function login(login, password) {

    console.log('login: ' + login + ', password: ' + password);
    fetch(server + '/login', {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({login, password}),
    })
        .then(async (response) => {
            console.log(response.status);
            let data = await response.json();
            if (response.status === 200) {
                alert("Login OK for user " + data.name + " " + data.familyName);
            }
            else if (response.status === 400){
                alert("error : " + data.error);
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

export function addUser(login, password, name, familyName, email) {

    fetch(server + '/users', {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({login, password, name, familyName, email}),
    })
        .then(async (response) => {
            console.log(response.status);
            let data = await response.json();
            if (response.status === 200) {
                alert("User " + data.name + " " + data.familyName + " successfully created");
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