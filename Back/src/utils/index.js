import mongoose from 'mongoose';
import sendMail from './mailer';

const isValidId = (id) => {
  if (id === '') {
    return false;
  }
  return (mongoose.Types.ObjectId.isValid(id));
};

const isAdminInPlaylist = (playlist, userId) => {
  let flag = false;
  for (let j = 0; j < playlist.admins.length; j += 1) {
    if (String(playlist.admins[j]._id) === String(userId)) {
      flag = true;
    }
  }
  return (flag);
};

const isInBans = (playlist, userId) => {
  let flag = false;
  for (let i = 0; i < playlist.bans.length; i += 1) {
    if (String(playlist.bans[i]) === String(userId)) {
      flag = true;
      break;
    }
  }
  return (flag);
};

const isInUsers = (playlist, userId) => {
  let flag = false;
  for (let i = 0; i < playlist.users.length; i += 1) {
    if (String(playlist.users[i]) === String(userId)) {
      flag = true;
      break;
    }
  }
  return (flag);
};

export default {
  isValidId,
  sendMail,
  isAdminInPlaylist,
  isInBans,
  isInUsers,
};
