import React, { Component } from 'react';
import Player from '../components/player/Player';

export const TRACKS = [
  {
    title: 'Hit the road Jack',
    artist: 'Ray Charles',
    albumArtUrl: 'https://api.deezer.com/album/14030736/image',
    audioUrl: 'http://10.3.1.3:3000/tracks/Ray%20Charles/(2011)%20-%20Ray%20Charles_%20Grandes%20Exitos/1-07%20-%20Hit%20the%20Road%20Jack.mp3',
  },
  {
    title: 'Love Yourself',
    artist: 'Justin Bieber',
    albumArtUrl: 'http://arrestedmotion.com/wp-content/uploads/2015/10/JB_Purpose-digital-deluxe-album-cover_lr.jpg',
    audioUrl: 'http://srv2.dnupload.com/Music/Album/Justin%20Bieber%20-%20Purpose%20(Deluxe%20Version)%20(320)/Justin%20Bieber%20-%20Purpose%20(Deluxe%20Version)%20128/05%20Love%20Yourself.mp3',
  },
  {
    title: 'Hotline Bling',
    artist: 'Drake',
    albumArtUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Drake_-_Hotline_Bling.png',
    audioUrl: 'http://dl2.shirazsong.org/dl/music/94-10/CD%201%20-%20Best%20of%202015%20-%20Top%20Downloads/03.%20Drake%20-%20Hotline%20Bling%20.mp3',
  },
];

export default class AdminPlayer extends Component {
  render() {
    return (
      <Player tracks={TRACKS} />
    );
  }
}
