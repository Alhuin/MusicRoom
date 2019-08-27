import { Router } from 'express';
import userController from './userController';
import musicController from './musicController';
import playlistController from './playlistController';
import voteController from './voteController';
import loginController from './loginController';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send('OK');
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
router.post('/voteMusic', musicController.voteMusic);
router.post('/deezPy', musicController.downloadMusic);


/*             Playlists                 */

router.get('/playlists', playlistController.getPlaylists);
router.get('/playlists/:playlistId', playlistController.getPlaylistById);
router.post('/playlists/add', playlistController.addPlaylist);
router.delete('/playlists/:playlistId', playlistController.deletePlaylistById);


/*             Votes                 */

router.get('/votes', voteController.getVotes);
router.get('/votes/:voteId', voteController.getVoteById);
router.delete('/votes/:voteId', voteController.deleteVoteById);

export default router;
