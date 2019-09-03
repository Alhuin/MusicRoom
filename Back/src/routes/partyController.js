import partyService from '../services/partyService';
import utils from '../utils';

function getPartys(req, res) {
  partyService.getPartys()
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

function getPartyById(req, res) {
  if ((req.params.partyId && utils.isValidId(req.params.partyId))) {
    partyService.getPartyById(req.params.partyId)
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

function addParty(req, res) {
  // conditions à revoir, checker la validité des admins
  if (req.body.playlist && req.body.otherStuffToPutIn && req.body.admin) {
    partyService.addParty(req.body.playlist,
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

function deletePartyById(req, res) {
  if (req.params.partyId && utils.isValidId(req.params.partyId)) {
    partyService.deletePartyById(req.params.partyId)
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
  getPartyById,
  getPartys,
  addParty,
  deletePartyById,
};
