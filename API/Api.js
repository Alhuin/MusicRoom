const server = "http://68f93cc9.ngrok.io";
import Navigation from '../src/Navigation/Navigation'

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
        response = await response.json();
        console.log(response);

    })
        .catch((error) => {
            console.error(error);
            return false
        })
}