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

const degreesToRadians = (degrees) => {
  const pi = Math.PI;
  return degrees * (pi / 180);
};

const getDistanceLongLat = (lat1, lng1, lat2, lng2) => {
  const earthRadius = 63781370;
  const rlo1 = degreesToRadians(lng1);
  const rla1 = degreesToRadians(lat1);
  const rlo2 = degreesToRadians(lng2);
  const rla2 = degreesToRadians(lat2);
  const dlo = (rlo2 - rlo1) / 2;
  const dla = (rla2 - rla1) / 2;
  const a = (Math.sin(dla) * Math.sin(dla)) + Math.cos(rla1) * Math.cos(rla2)
    * (Math.sin(dlo) * Math.sin(dlo));
  const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (earthRadius * d);
};

const isEditorInPlaylist = (playlist, userId, pos) => {
  console.log(pos);
  if (playlist.editRestriction === 'ALL') {
    return (true);
  }
  if (playlist.editRestriction === 'USER_RESTRICTED') {
    for (let i = 0; i < playlist.users.length; i += 1) {
      if (String(playlist.users[i]._id) === userId) {
        return (true);
      }
    }
  } else if (playlist.editRestriction === 'ADMIN_RESTRICTED') {
    for (let i = 0; i < playlist.admins.length; i += 1) {
      if (String(playlist.admins[i]._id) === userId) {
        return (true);
      }
    }
  } else if (playlist.editRestriction === 'EVENT_RESTRICTED') {
    const now = new Date(Date.now());
    if (now < playlist.endDate && now > playlist.startDate) {
      let lat1 = 0;
      let lng1 = 0;
      let lat2 = 0;
      let lng2 = 0;
      if (Object.keys(pos).length !== 0) {
        lat1 = pos.coords.latitude;
        lng1 = pos.coords.longitude;
      }
      if (Object.keys(playlist.location).length !== 0) {
        lat2 = playlist.location.coords.latitude;
        lng2 = playlist.location.coords.longitude;
      }
      for (let i = 0; i < playlist.users.length; i += 1) {
        if ((Object.keys(playlist.location).length === 0 && String(playlist.admins[i]._id) === userId)
          || (Object.keys(playlist.location).length !== 0 && String(playlist.users[i]._id) === userId
            && Object.keys(pos).length !== 0 && getDistanceLongLat(lat1, lng1, lat2, lng2) <= 100)) {
          return (true);
        }
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
