import loginService from '../services/loginService';

function login(req, res) {
  if ((req.body.login && req.body.password)) {
    loginService.login(req.body.login, req.body.password)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        console.error(error);
        // console.log(error);
        res
          .status(error.status)
          .send(error);
      });
  } else {
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

export default {
  login,
};
