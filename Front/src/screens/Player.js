import React, { Component } from 'react';
import Player from '../components/Player/Player';
// import {getMyVotesInPlaylist} from "../../API/BackApi";

export default class AdminPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: props.navigation.getParam('track'),
    };
  }

  // componentDidMount(): void {
  //   getMyVotesInPlaylist(userId, playlistId)
  //     .then((votes) => {
  //       this.setState({ myVotes: votes });
  //       resolve();
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       reject(error);
  //     });
  //   this.setState({ track });
  // }

  render() {
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const { track } = this.state;

    return (
      <Player
        track={track}
        playlistId={playlistId}
        onDownPress={() => {
          navigation.navigate('Playlist', { playlistId });
        }}
      />
    );
  }
}
