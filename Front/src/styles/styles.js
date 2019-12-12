import { Dimensions, StyleSheet } from 'react-native';
import * as Buttons from './buttons';
import * as Colors from './colors';
import * as Spacing from './spacing';
import * as Typography from './typography';

const Controls = StyleSheet.create({
  playButton: {
    height: 72,
    width: 72,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 72 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryControl: {
    height: 18,
    width: 18,
  },
  off: {
    opacity: 0.30,
  },
});

const Header = StyleSheet.create({
  container: {
    height: 72,
    paddingTop: 20,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'row',
  },
  message: {
    flex: 1,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.72)',
    fontWeight: 'bold',
    fontSize: 10,
  },
  button: {
    opacity: 0.72,
  },
});

const PlayerDetails = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(4,4,4)',
  },
});

const SeekBar = StyleSheet.create({
  slider: {
    marginTop: -12,
  },
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  track: {
    height: 2,
    borderRadius: 1,
  },
  thumb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  text: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12,
    textAlign: 'center',
  },
});

const TrackDetails = StyleSheet.create({
  container: {
    paddingTop: 24,
    flexDirection: 'row',
    paddingLeft: 20,
    alignItems: 'center',
    paddingRight: 20,
  },
  detailsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  artist: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    opacity: 0.72,
  },
  moreButton: {
    borderColor: 'rgb(255, 255, 255)',
    borderWidth: 2,
    opacity: 0.72,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonIcon: {
    height: 17,
    width: 17,
  },
});

const TrackInPlaylist = StyleSheet.create({
  card: {
    padding: Spacing.smallest,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  main_container: {
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 20,
    overflow: 'hidden',
  },
  previewCover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },
  content_container: {
    flexDirection: 'column',
    flex: 3,
    margin: 5,
    justifyContent: 'center',
  },
  title_container: {
    flex: 2,
    flexDirection: 'row',
  },
  title_text: {
    flexWrap: 'wrap',
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 5,
    color: 'white',
  },
  artist_container: {
    flex: 1,
    color: 'white',
  },
  artist_name: {
    color: 'white',
  },
  album_container: {
    flex: 1,
  },
  album_title: {
    fontStyle: 'italic',
    color: 'white',
  },
  voting_container: {
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: 'blue',
    flex: 2,
  },
  note_container: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'green',
  },
  votes_container: {
    flex: 1,
    height: 120,
    flexDirection: 'column',
    justifyContent: 'space-around',
    // borderWidth: 1,
    // borderColor: 'orange',
  },
  vote_container: {
    width: 50,
    // borderWidth: 1,
    // borderColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const UserListInSettings = StyleSheet.create({
  list: {
    // backgroundColor: '#DDDDDD',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 5,
    padding: 5,
    flex: 1,
    alignItems: 'center',
    height: 40,
    backgroundColor: '#CCCCCC',
    borderRadius: 20,
    overflow: 'hidden',
  },
  title: {
    // backgroundColor: '#888888',
    padding: 10,
    margin: 5,
  },
  touchableWrapper: {
    height: '100%',
    flexDirection: 'row',
  },
  iconWrapper: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconsStyle: {
    fontSize: 40,
  },
});

const AdminListInSettings = StyleSheet.create({
  list: {
    // backgroundColor: '#DDDDDD',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 5,
    padding: 5,
    flex: 1,
    alignItems: 'center',
    height: 40,
    backgroundColor: '#CCCCCC',
    borderRadius: 20,
    overflow: 'hidden',
  },
  title: {
    // backgroundColor: '#888888',
    padding: 10,
    margin: 5,
  },
  touchableWrapper: {
    height: '100%',
    flexDirection: 'row',
  },
  iconWrapper: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconsStyle: {
    fontSize: 40,
  },
  iconsStyleBlank: {
    fontSize: 40,
    color: 'white',
  },
  authorIconStyle: {
    fontSize: 40,
  },
});

const BanListInSettings = StyleSheet.create({
  list: {
    // backgroundColor: '#DDDDDD',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 5,
    padding: 5,
    flex: 1,
    alignItems: 'center',
    height: 40,
    backgroundColor: '#CCCCCC',
    borderRadius: 20,
    overflow: 'hidden',
  },
  title: {
    // backgroundColor: '#888888',
    padding: 10,
    margin: 5,
  },
  touchableWrapper: {
    height: '100%',
    flexDirection: 'row',
  },
  iconWrapper: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconsStyle: {
    fontSize: 40,
  },
  iconsStyleBlank: {
    fontSize: 40,
    color: 'white',
  },
  authorIconStyle: {
    fontSize: 40,
  },
});

const FriendsInSettings = StyleSheet.create({
  list: {
    // backgroundColor: '#DDDDDD',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    padding: 5,
    flex: 1,
    alignItems: 'center',
    height: 40,
    backgroundColor: '#CCCCCC',
    borderRadius: 20,
    overflow: 'hidden',
  },
  title: {
    // backgroundColor: '#888888',
    padding: 10,
    margin: 5,
  },
  touchableWrapper: {
    height: '100%',
    flexDirection: 'row',
  },
  iconWrapper: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconsStyle: {
    fontSize: 45,
  },
  iconsStyleBlank: {
    fontSize: 45,
    color: 'white',
  },
  authorIconStyle: {
    fontSize: 45,
  },
});

const MiniPlayer = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    backgroundColor: '#404040',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    // elevation: 2,
    width: '100%',
    flexDirection: 'column',
  },
  coverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
    height: 50,
    width: 50,
  },
  detailsContainer: {
    flex: 3,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upContainer: {
    // borderWidth: 1,
    // borderColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controls: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downContainer: {
    // borderWidth: 1,
    // borderColor: 'red',
    width: '100%',
  },
});

const AddPlaylistModal = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  Name: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '40%',
  },
  switch: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

const PlaylistInPlaylists = StyleSheet.create({
  list: {
    flexDirection: 'column',
    margin: 5,
    backgroundColor: 'white',
    height: 120,
    justifyContent: 'space-around',
    padding: 10,
    elevation: 1,
  },
  Author: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

const SearchTrack = StyleSheet.create({
  loading: {
    opacity: 1,
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    color: 'white',
  },
});

const TrackInSearch = StyleSheet.create({
  card: {
    padding: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  main_container: {
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 20,
    overflow: 'hidden',
  },
  previewCover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },
  content_container: {
    flexDirection: 'column',
    flex: 3,
    paddingLeft: 10,
    margin: 5,
    justifyContent: 'center',
  },
  title_container: {
    flex: 2,
    flexDirection: 'row',
  },
  title_text: {
    flexWrap: 'wrap',
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 5,
    color: 'white',
  },
  artist_container: {
    flex: 1,
    color: 'white',
  },
  artist_name: {
    color: 'white',
  },
  album_container: {
    flex: 1,
  },
  album_title: {
    fontStyle: 'italic',
    color: 'white',
  },
  addContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const TrackListInSearch = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
});

const AddFloatingButton = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    // bottom: this.props.icon === 'addMusic' ? 150 : 70,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    // elevation: 8,
  },
  fabIcon: {
    transform: [{ translateX: +2 }],
    height: 30,
    width: 30,
    color: 'white',
  },
});

const SearchBar = StyleSheet.create({
  textInput: {
    backgroundColor: '#666666',
  },
});

let AppSettings = StyleSheet.create({
  main_container: {
    flex: 1,
    // height: 120,
  },
  card: {
    minHeight: 110,
    flexDirection: 'column',
    justifyContent: 'space-around',
    // alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 20,
    padding: 10,
    margin: 10,
  },
  content_container: {
    flexDirection: 'row',
    margin: 5,
    flex: 2,
    justifyContent: 'space-around',
  },
  title_container: {
    flex: 1,
  },
  title_text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 6,
  },
  inputStyle: {
    // width: '60%',
    color: 'white',
  },
  title_set: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingRight: 5,
    textAlign: 'center',
  },
  checkboxRow: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  checkboxesWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    fontSize: 40,
    color: 'white',
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
    margin: 5,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    // textAlign: 'center',
    fontSize: 22,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    padding: 5,
    flex: 1,
    alignItems: 'center',
    height: 40,
    backgroundColor: '#CCCCCC',
    borderRadius: 20,
    overflow: 'hidden',
  },
  elementListTitle: {
    padding: 10,
    margin: 5,
  },
  touchableWrapper: {
    height: '100%',
    flexDirection: 'row',
    flex: 1,
  },
});

const Connexion = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  scrollView: {
    width: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginContext: {
    alignItems: 'flex-end',
  },
});

const Home = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    color: 'white',
    width: '100%',
    flexDirection: 'column',
    // flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  cartes: {
    borderWidth: 3,
    borderRadius: 3,
    borderColor: '#000',
    height: '45%',
    width: '80%',
    aspectRatio: 1,
    justifyContent: 'space-around',
  },
  place: {
    alignItems: 'center',
  },
  textcard: {
    fontWeight: 'bold',
    fontSize: 30,
  },
});

const Inscription = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  scrollView: {
    width: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginContext: {
    alignItems: 'flex-end',
  },
});

const Playlist = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    color: 'white',
    flex: 1,
  },
  headerIconWrapper: {
    marginLeft: 10,
  },
  headerContainer: {
    width: '90%',
    flexDirection: 'row',
    paddingRight: 10,
  },
  title: {
    fontSize: 22,
    marginLeft: 10,
  },
  playerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  playButton: {
    height: 50,
    width: 180,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1db954',
    lineHeight: 1,
    borderRadius: 25,
    margin: (Dimensions.get('window').width - 180) / 2,
  },
  playText: {
    color: 'white',
    textTransform: 'uppercase',
  },
});

export { };
