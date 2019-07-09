import loginService from '../services/loginService'

function login(req, res) {
    // console.log('loginCtrl');
    if ((req.body.login && req.body.password)){
        loginService.login(req.body.login, req.body.password)
            .then((response) => {
                // console.log('login 200');
                res
                    .status(response.status)
                    .send(response.data);
            })
            .catch((error) => {
                // console.log('login KO');
                // console.log(error);
                // console.error(error);
                res
                    .status(error.status)
                    .send(error);
            })
    }
    else {
        res.status(400).send({msg: "Wrong Parameters"});
    }
}

export default {
    login,
}