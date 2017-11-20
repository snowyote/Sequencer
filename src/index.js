import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import Sound from 'react-sound';

const soundUrls = [
  'http://www.denhaku.com/r_box/ddd1/bass1.wav',
  'http://www.whitenote.dk/Download%20Frame/Whitenote%20Sampels/Slave%20of%20your%20lust/Hi-hat%203.wav',
  'http://www.denhaku.com/r_box/sr16/sr16hat/edge%20hat.wav',
  'http://www.denhaku.com/r_box/sr16/sr16sd/dynohlsn.wav',
];

class SampleButton extends React.Component {
  render() {
    return <button className={this.props.className} onClick={() => this.props.onClick()} id={this.props.id} />;
  }
}

class MySlider extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: 0,
    };
  }

  handleChange = value => {
    if (value !== this.state.value) {
      this.setState({
        value: value,
      });
    }
  };

  render() {
    const {value} = this.state;
    return (
      <div>
        <div className="slider">
          <Slider min={1} max={7} value={value} onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}

class Sampler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: Array(4).fill(Array(8).fill(false)),
      playStatus: Array(4).fill(Array(8).fill('STOPPED')),
      currentBeat: 0,
    };
  }

  makeColumnOfButtons(column, name, soundUrl) {
    const buttonArray = [0, 1, 2, 3, 4, 5, 6, 7];
    const buttons = buttonArray.map((beat, row) => (
      <SampleButton
        key={beat + name}
        beat={beat}
        activeBeat={this.props.activeBeat}
        isPressed={this.state.buttons[column][row]}
        onClick={() => this.handleClick(column, row)}
        className={this.state.buttons[column][row] ? 'active' : ''}
        id={this.state.currentBeat === row ? 'currentBeat' : ''}
      />
    ));
    return <ul>{buttons}</ul>;
  }

  handleClick(i, j) {
    // Make copy of state.buttons to mutate
    let oldState = this.state.buttons;
    var newState = [];
    for (var index = 0; index < oldState.length; index++) {
      newState[index] = oldState[index].slice();
    }
    let buttonToChange = newState[i][j];
    let changedButton = buttonToChange === true ? false : true;
    newState[i][j] = changedButton;
    this.setState({buttons: newState});
  }

  makeTableOfButtons() {
    const buttonArray = ['Sound0', 'Sound1', 'Sound2', 'Sound3'];
    const buttonColumns = buttonArray.map((name, column) => (
      <div key={name}>{this.makeColumnOfButtons(column, name, soundUrls[column])}</div>
    ));
    return buttonColumns;
  }

  onFinishedPlaying(i, j) {
    // when the beat is advanced to OUR beat, we want to trigger a sound
    // when the beat is advanced to the NEXT beat, we want to keep PLAYING
    // when we stop playing, we wanna make a note of that so we don't loop on re-render
    let newStatus = this.state.playStatus.map(row => row.slice());
    newStatus[i][j] = 'STOPPED';
    this.setState({playStatus: newStatus});
  }

  renderSamples() {
    // return soundUrls.map((url, i) => (
    //   <Sound key={url} url={url} playStatus={this.state.buttons[i][this.state.currentBeat]} />
    // ));
    const allButtons = this.state.buttons;
    let self = this;
    return allButtons.map((thisButton, i) =>
      thisButton.map((beat, j) => (
        <Sound
          key={'row' + i + 'col' + j}
          url={soundUrls[i]}
          // this.state.buttons[i][j] && this.state.currentBeat === beat ? 'PLAYING' : 'STOPPED'
          playStatus={this.state.playStatus[i][j]}
          onFinishedPlaying={self.onFinishedPlaying(i, j)}
        />
      ))
    );
  }

  advanceBeat() {
    const currentBeat = (this.state.currentBeat + 1) % 8;
    let playStatus = this.state.playStatus.map(row => row.slice());
    for (let i = 0; i < this.state.buttons.length; ++i) {
      const enabled = this.state.buttons[i][currentBeat];
      if (enabled) {
        playStatus[i][currentBeat] = 'PLAYING';
      }
    }
    this.setState({currentBeat, playStatus});
  }

  render() {
    return (
      <div>
        <MySlider />
        <div>
          <ul>{this.makeTableOfButtons()}</ul>
        </div>
        <div className="SoundPlayers">{this.renderSamples()}</div>
      </div>
    );
  }
}

// ========================================
const rootComponent = ReactDOM.render(<Sampler />, document.getElementById('root'));
setInterval(() => rootComponent.advanceBeat(), 250);
