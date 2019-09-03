import PartyModel from '../models/partyModel';
import CustomError from './errorHandler';
import models from '../models';

function getPartys() {
  return new Promise((resolve, reject) => {
    PartyModel.find({}, (error, partys) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!partys.length) {
        reject(new CustomError('No partys in database', 400));
      } else {
        resolve({
          status: 200,
          data: partys,
        });
      }
    });
  });
}

function getPartyById(partyId) {
  return new Promise((resolve, reject) => {
    PartyModel.findById(partyId, (error, party) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!party) {
        reject(new CustomError('No party with this id in databse', 400));
      } else {
        resolve({
          status: 200,
          data: party,
        });
      }
    });
  });
}

function addParty(playlist, admins, otherStuffToPutIn) {
  return new Promise((resolve, reject) => {
    const party = new models.Party({
      playlist,
      admins,
      otherStuffToPutIn,
    });
    party.save((saveError, savedParty) => {
      if (saveError) {
        reject(new CustomError(saveError, 500));
      } else {
        resolve({
          status: 200,
          data: savedParty,
        });
      }
    });
  });
}

function deletePartyById(partyId) {
  return new Promise((resolve, reject) => {
    PartyModel.findById(partyId, (error, party) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!party) {
        reject(new CustomError('No party with this id in database', 400));
      } else {
        party.remove((removeError, partyRemoved) => {
          if (removeError) {
            reject(new CustomError(removeError, 500));
          } else {
            resolve({
              status: 200,
              data: partyRemoved,
            });
          }
        });
      }
    });
  });
}

export default {
  getPartys,
  getPartyById,
  addParty,
  deletePartyById,
};
