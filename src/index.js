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
  constructor() {
    super();
    this.state = {
      url : 'http://www.fundmental.com/funpages/wavs/guff.wav',
      playStatus : Sound.status.STOPPED,
      playFromPosition : 300 /* in milliseconds */,
      onLoading : this.handleSongLoading,
      onPlaying : this.handleSongPlaying,
      onFinishedPlaying : this.handleSongFinishedPlaying,
    }
  }

  handleClick() {
    this.setState({playStatus : Sound.status.PLAYING})
  }

  render() { return <div>
      <button onClick={this.handleClick.bind(this)}>Fart</button>
      <Sound
        url={this.state.url}
        playStatus={this.state.playStatus}
        playFromPosition={this.state.playFromPosition}
        />
    </div>
  }
}

// ========================================

ReactDOM.render(
  <PlayButton/>,
  document.getElementById('root')
);
