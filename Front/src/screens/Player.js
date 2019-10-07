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
    // console.log(this.props.navigation.params.track);
    console.log(this.props.navigation);
    console.log('------------------------');
    console.log('ICI');
    console.log(this.props.navigation.getParam('track'));
    const { track } = this.state;
    console.log(track);
    const { playlistId } = this.props;

    return (
      <Player track={track} playlistId={playlistId} />
    );
  }
}
