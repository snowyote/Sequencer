import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Sound from 'react-sound'

class FartButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isActive : false,
      url : 'http://www.fundmental.com/funpages/wavs/guff.wav',
      playStatus : Sound.status.STOPPED,
      playFromPosition : 300 /* in milliseconds */,
      onLoading : this.handleSongLoading,
      onPlaying : this.handleSongPlaying,
      onFinishedPlaying : this.handleSongFinishedPlaying,
    }
    this.handleClick = this.handleClick.bind(this);
    // this.handleClick = () => this.handleClick()
  }

  handleClick() {
    let oldPlayStatus = this.state.playStatus
    let newPlayStatus = ((playStatus) => {
      return playStatus === "STOPPED" ? "PLAYING" : "STOPPED"
    })(oldPlayStatus)
    console.log(oldPlayStatus)
    console.log(newPlayStatus)
    this.setState({
      isActive : !this.state.isActive,
      playStatus : newPlayStatus,
    })
  }

  render() {
    // this.state.isActive && this.props.is
    return <span>
      <button
        className = {this.state.isActive ? "active" : ""}
        onClick={this.handleClick}>
      </button>
      <Sound
        url={this.state.url}
        playStatus={this.state.playStatus}
        playFromPosition={this.state.playFromPosition}
        />
    </span>
  }
}

class ButtonMatrix extends React.Component {

  constructor() {
    super()
    this.state = {
      buttons : [],
      activeBeat : 0,
      isPlaying: true,
      buttons: null,
    }
    this.startLoop()
  }

  startLoop() {
    setInterval(this.printBalls, 1000);
  }

  printBalls() {
    console.log("balls")
  }

  makeColumnOfButtons(name) {
    const buttonArray = ["Beat0","Beat1","Beat2","Beat3","Beat4","Beat5",
    "Beat6","Beat7"];
    const buttons = buttonArray.map((beat) =>
    <FartButton
      key={beat+name}
      beat={beat}>
    </FartButton>
    );
  return <ul>{buttons}</ul>
  }

  render() {
    const buttonArray = ["Sound0"];
    const buttonColumns = buttonArray.map((name) =>
    <div key = {name}>
      {this.makeColumnOfButtons(name)}
  </div>);
    return <ul>{buttonColumns}</ul>
  }

}

// ========================================

ReactDOM.render(
  <ButtonMatrix/>,
  document.getElementById('root')
);
