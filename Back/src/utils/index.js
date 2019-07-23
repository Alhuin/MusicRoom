import mongoose from 'mongoose';
import sendMail from './mailer';

const isValidId = (id) => {
  if (id === '') {
    return false;
  }
  return (mongoose.Types.ObjectId.isValid(id));
};


export default {
  isValidId,
  sendMail,
};
