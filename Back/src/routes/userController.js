import userService from '../services/userService';
import utils from '../utils';

/*    Fetch     */

function getUsers(req, res) {
  userService.getUsers()
    .then((response) => {
      res
        .status(response.status)
        .send(response.data);
    })
    .catch((error) => {
      console.error(error.msg);
      res
        .status(error.status)
        .send(error.msg);
    });
}

function getUserById(req, res) {
  if ((req.params.userId && utils.isValidId(req.params.userId))) {
    userService.getUserById(req.params.userId)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        console.error(error.msg);
        res
          .status(error.status)
          .send(error.msg);
      });
  } else {
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

function deleteUserById(req, res) {
  if ((req.params.userId && utils.isValidId(req.params.userId))) {
    userService.deleteUserById(req.params.userId)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        console.error(error.msg);
        res
          .status(error.status)
          .send(error.msg);
      });
  } else {
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

function addUser(req, res) {
  console.log(req.body.login + req.body.password + req.body.name
    + req.body.familyName + req.body.email);
  // checker email valide et les champs uniques
  if ((req.body.login && req.body.password && req.body.name
    && req.body.familyName && req.body.email)) {
    userService.addUser(req.body.login, req.body.password, req.body.name,
      req.body.familyName, req.body.email)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        console.error(error.msg);
        res
          .status(error.status)
          .send(error.msg);
      });
  } else {
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

/*    User Interface    */

function updatePassword(req, res) {
  if (req.body.userId && req.body.password) {
    userService.updatePassword(req.body.userId, req.body.password)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        console.error(error);
        res
          .status(error.status)
          .send(error.msg);
      });
  } else {
    res.status(400).send({ msg: 'Wrong parameters' });
  }
}

/*    Mail Tokens    */

function sendEmailToken(req, res) {
  if (req.body.loginOrEmail) {
    userService.askEmailToken(req.body.loginOrEmail)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        console.error(error);
        res
          .status(error.status)
          .send(error.msg);
      });
  } else {
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

function confirmEmailToken(req, res) {
  if (req.params.token) {
    userService.confirmEmailToken(req.params.token)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        console.error(error);
        res
          .status(error.status)
          .send(error.msg);
      });
  } else {
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

function sendPasswordToken(req, res) {
  if (req.body.loginOrEmail) {
    userService.sendPasswordToken(req.body.loginOrEmail)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        console.error(error);
        res
          .status(error.status)
          .send(error.msg);
      });
  } else {
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

function confirmPasswordToken(req, res) {
  if (req.params.token) {
    userService.confirmPasswordToken(req.params.token)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        console.error(error);
        res
          .status(error.status)
          .send(error.msg);
      });
  } else {
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

export default {
  getUserById,
  getUsers,
  deleteUserById,
  addUser,
  sendEmailToken,
  sendPasswordToken,
  confirmEmailToken,
  confirmPasswordToken,
  updatePassword,
};
