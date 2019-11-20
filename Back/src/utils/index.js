import mongoose from 'mongoose';
import sendMail from './mailer';

const isValidId = (id) => {
  if (id === '') {
    return false;
  }
  return (mongoose.Types.ObjectId.isValid(id));
};

const isAdminInPlaylist = (playlist, userId) => {
  for (let j = 0; j < playlist.admins.length; j += 1) {
    if (String(playlist.admins[j]._id) === String(userId)) {
      return (true);
    }
  }
  return (false);
};

const isEditorInPlaylist = (playlist, userId) => {
  if (playlist.editRestriction === 'ALL') {
    return (true);
  }
  if (playlist.editRestriction === 'USER_RESTRICTION') {
    for (let i = 0; i < playlist.users.length; i += 1) {
      if (String(playlist.users[i]._id) === userId) {
        return (true);
      }
    }
  } else if (playlist.editRestriction === 'ADMIN_RESTRICTION') {
    for (let i = 0; i < playlist.admins.length; i += 1) {
      if (String(playlist.admins[i]._id) === userId) {
        return (true);
      }
    }
  } else if (playlist.editRestriction === 'EVENT_RESTRICTION') {
    const now = new Date(Date.now());
    for (let i = 0; i < playlist.users.length; i += 1) {
      if (String(playlist.users[i]._id) === userId
        && now < playlist.endDate && now > playlist.startDate
      /* && CONDITION ON LOCATION */) {
        return (true);
      }
    }
  }
  return (false);
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
  isEditorInPlaylist,
};
