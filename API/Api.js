export function API_login(login, password){
    fetch('http://d47e4e47.ngrok.io/login', {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({login:"admin", password:"adm"}),
    })
        .then(async (response) => {
            response = await response.json();
            console.log(response)
        })
        .catch((error) => console.error(error))
}