import RadioModel from '../models/radioModel';
import CustomError from './errorHandler';
import models from "../models";

function getRadios() {
  return new Promise((resolve, reject) => {
    RadioModel.find({}, (error, radios) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!radios.length) {
        reject(new CustomError('No radios in database', 400));
      } else {
        resolve({
          status: 200,
          data: radios,
        });
      }
    });
  });
}

function getRadioById(radioId) {
  return new Promise((resolve, reject) => {
    RadioModel.findById(radioId, (error, radio) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!radio) {
        reject(new CustomError('No radio with this id in databse', 400));
      } else {
        resolve({
          status: 200,
          data: radio,
        });
      }
    });
  });
}

function addRadio(playlist, admins, otherStuffToPutIn) {
  return new Promise((resolve, reject) => {
    const radio = new models.Radio({
      playlist,
      admins,
      otherStuffToPutIn,
    });
    radio.save((saveError, savedRadio) => {
      if (saveError) {
        reject(new CustomError(saveError, 500));
      } else {
        resolve({
          status: 200,
          data: savedRadio,
        });
      }
    });
  });
}

function deleteRadioById(radioId) {
  return new Promise((resolve, reject) => {
    RadioModel.findById(radioId, (error, radio) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!radio) {
        reject(new CustomError('No radio with this id in database', 400));
      } else {
        radio.remove((removeError, radioRemoved) => {
          if (removeError) {
            reject(new CustomError(removeError, 500));
          } else {
            resolve({
              status: 200,
              data: radioRemoved,
            });
          }
        });
      }
    });
  });
}

export default {
  getRadios,
  getRadioById,
  addRadio,
  deleteRadioById,
};
