import { Router } from 'express';
import userController from './userController';
import musicController from './musicController';
import playlistController from './playlistController';
import voteController from './voteController';
import loginController from './loginController';
/* import partyController from './partyController';
import radioController from './radioController'; */

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send('Welcome to MusicRoom API !');
});

/*             Login                 */

router.post('/login', loginController.login);


/*             Users                 */

router.get('/users', userController.getUsers);
router.get('/users/:userId', userController.getUserById);
router.delete('/users/:userId', userController.deleteUserById);
router.post('/users', userController.addUser);
router.post('/users/newPass/', userController.updatePassword);

// Mail Tokens
router.post('/users/emailToken/', userController.sendEmailToken);
router.get('/users/emailToken/:token', userController.confirmEmailToken);
router.post('/users/passToken/', userController.sendPasswordToken);
router.get('/users/passToken/:token', userController.confirmPasswordToken);


/*             Musics                 */

router.get('/musics', musicController.getMusics);
router.get('/musics/:musicId', musicController.getMusicById);
router.get('/musicsByVote/:playlistId', musicController.getMusicsByVote);
router.delete('/musics/:musicId', musicController.deleteMusicById);
router.post('/musics/add', musicController.addMusicToPlaylist);
router.post('/deezPy', musicController.downloadMusic);


/*             Playlists                 */

router.get('/playlists', playlistController.getPlaylists);
router.get('/playlists/:roomType', playlistController.getPlaylistsFilteredByRoom);
router.post('/playlists/filtered', playlistController.getPlaylistsFiltered);
router.get('/playlists/:playlistId', playlistController.getPlaylistById);
router.get('/playlists/admins/:playlistId', playlistController.getAdminsByPlaylistId);
router.get('/playlists/bans/:playlistId', playlistController.getBansByPlaylistId);
router.post('/playlists/admins/downgrade', playlistController.adminInPlaylistDowngrade);
router.get('/playlists/users/:playlistId', playlistController.getUsersByPlaylistId);
router.get('/playlists/publicity/:playlistId', playlistController.getPublicityOfPlaylistById);
router.get('/playlists/nextTrack/:playlistId', playlistController.getNextTrack);
router.post('/playlists/users/upgrade', playlistController.userInPlaylistUpgrade);
router.post('/playlists/users/ban', playlistController.BanUserInPlaylist);
router.post('/playlists/users/delete', playlistController.DeleteUserInPlaylist);
router.post('/playlists/add', playlistController.addPlaylist);
router.post('/playlists/isAdmin', playlistController.isAdmin);
router.delete('/playlists/:playlistId', playlistController.deletePlaylistById);


/*             Votes                 */

router.get('/votes', voteController.getVotes);
router.get('/votes/:voteId', voteController.getVoteById);
router.delete('/votes/:voteId', voteController.deleteVoteById);
router.post('/voteMusic', voteController.voteMusic);

export default router;
