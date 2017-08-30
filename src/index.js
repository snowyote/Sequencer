import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Button from 'react-button'
import Sound from 'react-sound'

class SoundPlayer extends React.Component {
  // constructor() {
  //
  // }
  render() {
    return <Sound
      url="http://www.fundmental.com/funpages/wavs/guff.wav"
      playStatus={Sound.status.PLAYING}
      playFromPosition={300 /* in milliseconds */}
      onLoading={this.handleSongLoading}
      onPlaying={this.handleSongPlaying}
      onFinishedPlaying={this.handleSongFinishedPlaying}
       />
  }
}

class PlayButton extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     sound : null,
  //   }
  // }

  handleClick() {
    return <SoundPlayer/>
  }

  render() {
    return <Button>
      // onPress={this.handleClick}
      Fart
    </Button>
  }
}

// ========================================

ReactDOM.render(
  <PlayButton/>,
  document.getElementById('root')
);
