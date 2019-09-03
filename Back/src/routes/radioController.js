import radioService from '../services/radioService';
import utils from '../utils';

function getRadios(req, res) {
  radioService.getRadios()
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
}

function getRadioById(req, res) {
  if ((req.params.radioId && utils.isValidId(req.params.radioId))) {
    radioService.getRadioById(req.params.radioId)
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
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

function addRadio(req, res) {
  // conditions à revoir, checker la validité des admins notamment
  if (req.body.playlist && req.body.otherStuffToPutIn && req.body.admin) {
    radioService.addRadio(req.body.playlist,
      req.body.otherStuffToPutIn, req.body.admin)
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
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

function deleteRadioById(req, res) {
  if (req.params.radioId && utils.isValidId(req.params.radioId)) {
    radioService.deleteRadioById(req.params.radioId)
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
    res.status(400).send({ msg: 'Wrong Parameters' });
  }
}

export default {
  getRadioById,
  getRadios,
  addRadio,
  deleteRadioById,
};
