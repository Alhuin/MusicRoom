import { Router } from 'express';
import userController from './userController';
import musicController from './musicController';
import playlistController from './playlistController';
import voteController from './voteController';
import loginController from './loginController';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send('Welcome to MusicRoom API !');
});

/**
 *    Catched routes redirect to a controller which checks the existence / validity
 *    of the arguments and then redirects to a service which handles the action.
 */

/*             Login                 */

router.post('/login', loginController.login);


/*             Users                 */

router.get('/users/deezer', userController.getDeezerCode);
router.get('/users/:userId', userController.getUserById);
router.get('/users', userController.getUsers);
router.get('/users/getByPreferences/:userId&:requesterId', userController.getUserByIdByPreferences);
router.get('/users/getFriends/:userId', userController.getFriends);
router.delete('/users/:userId', userController.deleteUserById);
router.post('/users', userController.addUser);
router.post('/users/update', userController.updateUser);
router.post('/users/addFriend', userController.addFriend);
router.post('/users/deleteFriend', userController.deleteFriend);
router.post('/users/newPass/', userController.updatePassword);

// Mail Tokens
router.post('/users/emailToken/', userController.sendEmailToken);
router.get('/users/emailToken/:token', userController.confirmEmailToken);
router.post('/users/passToken/', userController.sendPasswordToken);
router.get('/users/passToken/:token', userController.confirmPasswordToken);


/*             Musics                 */

router.get('/musics', musicController.getMusics);
router.get('/musics/:musicId', musicController.getMusicById);
router.get('/musicsByVote/:playlistId&:roomType', musicController.getMusicsByVote);
router.delete('/musics/:musicId', musicController.deleteMusicById);
router.post('/musics/add', musicController.addMusicToPlaylist);
router.post('/deezPy', musicController.downloadMusic);


/*             Playlists                 */

router.get('/playlists', playlistController.getPlaylists);
router.get('/playlists/:roomType', playlistController.getPlaylistsFilteredByRoom);
router.post('/playlists/filtered', playlistController.getPlaylistsFiltered);
router.get('/playlists/:playlistId', playlistController.getPlaylistById);
router.get('/playlists/name/:playlistId', playlistController.getPlaylistName);
router.get('/playlists/admins/:playlistId', playlistController.getAdminsByPlaylistId);
router.get('/playlists/bans/:playlistId', playlistController.getBansByPlaylistId);
router.get('/playlists/privateId/:playlistId', playlistController.getPlaylistPrivateId);
router.get('/playlists/dates/:playlistId', playlistController.getPlaylistDates);
router.get('/playlists/location/:playlistId', playlistController.getPlaylistLocation);
router.get('/playlists/getTags/:playlistId', playlistController.getTags);
router.get('/playlists/getEditRestriction/:playlistId', playlistController.getEditRestriction);
router.get('/playlists/delegatedPlayerAdmin/:playlistId', playlistController.getDelegatedPlayerAdmin);
router.post('/playlists/setDelegatedPlayerAdmin', playlistController.setDelegatedPlayerAdmin);
router.post('/playlists/admins/downgrade', playlistController.adminInPlaylistDowngrade);
router.get('/playlists/users/:playlistId', playlistController.getUsersByPlaylistId);
router.get('/playlists/publicity/:playlistId', playlistController.getPublicityOfPlaylistById);
router.get('/playlists/nextTrack/:playlistId', playlistController.getNextTrackByVote);
router.post('/playlists/users/upgrade', playlistController.userInPlaylistUpgrade);
router.post('/playlists/users/ban', playlistController.banUserInPlaylist);
router.post('/playlists/users/delete', playlistController.deleteUserInPlaylist);
router.post('/playlists/add', playlistController.addPlaylist);
router.post('/playlists/user/unbanned', playlistController.addUserToPlaylistAndUnbanned);
router.post('/playlists/isAdmin', playlistController.isAdmin);
router.post('/playlists/isEditor', playlistController.isEditor);
router.delete('/playlists/:playlistId', playlistController.deletePlaylistById);
router.delete('/playlists/deletePlaylistByAdmin', playlistController.deletePlaylistByAdmin);
router.post('/playlists/joinPlaylistWithCode', playlistController.joinPlaylistWithCode);
router.post('/playlists/joinPlaylistWithId', playlistController.joinPlaylistWithId);
router.post('/playlists/setPublicity', playlistController.setPublicityOfPlaylist);
router.post('/playlists/deleteTrack', playlistController.deleteTrackFromPlaylist);
router.post('/playlists/moveTrackOrder', playlistController.moveTrackOrder);
router.post('/playlists/setStartDate', playlistController.setStartDate);
router.post('/playlists/setEndDate', playlistController.setEndDate);
router.post('/playlists/setTags', playlistController.setTags);
router.post('/playlists/setPlaylistLocation', playlistController.setPlaylistLocation);
router.post('/playlists/setEditRestriction', playlistController.setEditRestriction);
router.post('/playlists/setPlaylistName', playlistController.setPlaylistName);


/*             Votes                 */

router.get('/votes', voteController.getVotes);
router.get('/votes/:voteId', voteController.getVoteById);
router.delete('/votes/:voteId', voteController.deleteVoteById);
router.post('/voteMusic', voteController.voteMusic);
router.post('/votes/playlist', voteController.getMyVotesInPlaylist);


export default router;
