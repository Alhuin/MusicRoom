import userController from './userController';
import musicController from './musicController';
import playlistController from './playlistController';
import voteController from './voteController'
import loginController from './loginController';
import {Router} from 'express';

const router = Router();

router.get('/', (req, res)=>{
    res.status(200).send('OK');
});

/**             Login                 **/

router.post('/login', loginController.login);


/**             Users                 **/

router.get('/users', userController.getUsers);
router.post('/users/askPasswordReset', userController.askPasswordReset);
router.get('/users/:userId', userController.getUserById);
router.delete('/users/:userId', userController.deleteUserById);
router.post('/users', userController.addUser);
router.get('/users/confirm/:token', userController.confirmEmail);


/**             Musics                 **/

router.get('/musics', musicController.getMusics);
router.get('/musics/:musicId', musicController.getMusicById);
router.delete('/musics/:musicId', musicController.deleteMusicById);


/**             Playlists                 **/

router.get('/playlists', playlistController.getPlaylists);
router.get('/playlists/:playlistId', playlistController.getPlaylistById);
router.delete('/playlists/:playlistId', playlistController.deletePlaylistById);


/**             Votes                 **/

router.get('/votes', voteController.getVotes);
router.get('/votes/:voteId', voteController.getVoteById);
router.delete('/votes/:voteId', voteController.deleteVoteById);


export default router;