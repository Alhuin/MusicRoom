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
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

export default {
  login,
};
