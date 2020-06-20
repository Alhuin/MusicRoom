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
      res
        .status(error.status)
        .send({ msg: error.msg });
    });
}

function getUserById(req, res) {
  if ((req.params.userId && utils.isValidId(req.params.userId))) {
    userService.getUserById(req.params.userId)
      .then((response) => {
        // console.log('GetUserById response from service');
        // console.log(response);
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        // console.log('GetUserById error from service');
        // console.error(error.msg);
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong parameters' });
  }
}

// Show user information filtered by his visibility preferences
function getUserByIdByPreferences(req, res) {
  if ((req.params.userId && utils.isValidId(req.params.userId)
    && req.params.requesterId && utils.isValidId(req.params.requesterId))) {
    userService.getUserByIdByPreferences(req.params.userId, req.params.requesterId)
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
    res.status(422).send({ msg: 'Wrong parameters' });
  }
}

function getFriends(req, res) {
  if ((req.params.userId && utils.isValidId(req.params.userId))) {
    userService.getFriends(req.params.userId)
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
    res.status(422).send({ msg: 'Wrong parameters' });
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
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong parameters' });
  }
}

function addUser(req, res) {
  if ((req.body.login && req.body.password && req.body.name
    && req.body.familyName && req.body.email && req.body.idDeezer !== undefined
    && req.body.idGoogle !== undefined)) {
    userService.addUser(req.body.login, req.body.password, req.body.name,
      req.body.familyName, req.body.email, req.body.idDeezer, req.body.idGoogle)
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

function updateUser(req, res) {
  if ((req.body.userId && utils.isValidId(req.body.userId)
    && req.body.newLogin && req.body.name && req.body.familyName
    && req.body.email && (req.body.phoneNumber || req.body.phoneNumber === '') && req.body.preferences
    && req.body.visibilityTable && (req.body.idDeezer || req.body.idDeezer === '') && (req.body.idGoogle || req.body.idGoogle === ''))) {
    userService.updateUser(req.body.userId, req.body.newLogin, req.body.name,
      req.body.familyName, req.body.email, req.body.phoneNumber, req.body.preferences,
      req.body.visibilityTable, req.body.idDeezer, req.body.idGoogle)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        console.error(error.msg);
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

function addFriend(req, res) {
  if ((req.body.friendId && utils.isValidId(req.body.friendId)
    && req.body.userId && utils.isValidId(req.body.userId))) {
    userService.addFriend(req.body.friendId, req.body.userId)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        console.error(error.msg);
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

function deleteFriend(req, res) {
  if ((req.body.friendId && utils.isValidId(req.body.friendId)
    && req.body.userId && utils.isValidId(req.body.userId))) {
    userService.deleteFriend(req.body.friendId, req.body.userId)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        console.error(error.msg);
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

/*    User Interface    */

function updatePassword(req, res) {
  if (req.body.userId && utils.isValidId(req.body.userId) && req.body.password) {
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
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong parameters' });
  }
}

function updatePremium(req, res) {
  if (req.body.userId && utils.isValidId(req.body.userId) && req.body.premium !== undefined) {
    userService.updatePremium(req.body.userId, req.body.premium)
      .then((response) => {
        res
          .status(response.status)
          .send(response.data);
      })
      .catch((error) => {
        console.error(error);
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong parameters' });
  }
}

/*    Tokens    */

//  Email

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
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

function confirmEmailToken(req, res) {
  if (req.params.token) {
    userService.confirmEmailToken(req.params.token)
      .then((response) => {
        res
          .status(response.status)
          .redirect('musicroom://music/auth/signIn?redirect=true');
      })
      .catch((error) => {
        console.error(error);
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

//  Password

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
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

function confirmPasswordToken(req, res) {
  if (req.params.token) {
    userService.confirmPasswordToken(req.params.token)
      .then(async (response) => {
        const data = await response.data;
        res
          .status(response.status)
          .redirect(`musicroom://music/auth/updatePass/${data._id}`);
      })
      .catch((error) => {
        console.error(error);
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

function getDeezerCode(req, res) {
  if (req.query.code) {
    userService.getDeezerCode(req.query.code)
      .then(async (response) => {
        const data = await response.data;
        res
          .status(response.status)
          .redirect(`musicroom://music/home/AppSettings/${data}`);
      })
      .catch((error) => {
        console.error(error);
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

function getDeezerCodeForLogin(req, res) {
  if (req.query.code) {
    userService.getDeezerCode(req.query.code)
      .then(async (response) => {
        const data = await response.data;
        res
          .status(response.status)
          .redirect(`musicroom://music/auth/signUp/${data}`);
      })
      .catch((error) => {
        console.error(error);
        res
          .status(error.status)
          .send({ msg: error.msg });
      });
  } else {
    res.status(422).send({ msg: 'Wrong Parameters' });
  }
}

function findUserByidSocial(req, res) {
  if (req.params.idSocial
    && (req.params.SocialType === 'Google' || req.params.SocialType === 'Deezer')) {
    userService.findUserByidSocial(req.params.idSocial, req.params.SocialType)
      .then(async (response) => {
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
    res.status(422).send({ msg: 'User not found' });
  }
}

export default {
  getUserById,
  getUserByIdByPreferences,
  getUsers,
  deleteUserById,
  addUser,
  sendEmailToken,
  sendPasswordToken,
  confirmEmailToken,
  confirmPasswordToken,
  updatePassword,
  updateUser,
  addFriend,
  deleteFriend,
  getFriends,
  getDeezerCode,
  getDeezerCodeForLogin,
  findUserByidSocial,
  updatePremium,
};
