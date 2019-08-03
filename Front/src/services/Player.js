import Sound from 'react-native-sound';

const play = (url) => {
  const track = new Sound(url, null, (error) => {
    if (error) {
      console.log('error loading track:', error);
    } else {
      track.play();
    }
  });
  return track;
};

const stop = (track) => {
  track.stop();
};

export default {
  play,
  stop,
};
