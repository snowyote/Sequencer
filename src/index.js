import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

var numBeats = 16;
var subDiv = 4;
var buttonCols = [];
for (var i = 1; i <= numBeats; i++) {
  buttonCols.push(i);
}

const sounds = [
  {
    name: 'Sound0',
    url: 'kick 11.wav',
  },
  {
    name: 'Sound1',
    url: 'Hat 52.wav',
  },
  {
    name: 'Sound2',
    url: 'Clap 13.wav',
  },
  {
    name: 'Sound3',
    url: 'snare 347.wav',
  },
];

class PlayPauseButton extends React.Component {
  constructor() {
    super();
    this.state = {
      status: 'PLAY',
    };
  }

  render() {
    return (
      <button className={'PlayPauseButton'} onClick={() => this.props.onClick()}>
        {this.props.status}
      </button>
    );
  }
}

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
      buttons: Array(sounds.length).fill(Array(buttonCols.length).fill(false)),
      currentBeat: 0,
      isPlaying: false,
    };
  }

  playPauseBeat() {
    if (this.state.isPlaying) {
      clearInterval(this.state.interval);
      this.setState({
        isPlaying: false,
      });
    } else {
      this.setState({
        interval: setInterval(() => this.advanceBeat(), 200),
        isPlaying: true,
      });
    }
  }

  getButtonClassName(active, num) {
    var result = '';
    var div = numBeats / subDiv;
    var arr = [0, 1, 2, 3, 8, 9, 10, 11];
    if (active) {
      result += 'active';
    }
    if (arr.includes(num)) {
      result += ' altBeat';
    }
    return result;
  }

  makeColumnOfButtons(column, name) {
    // className={this.getButtonClassName(this.state.buttons[column][row], row)}
    const buttons = buttonCols.map((beat, row) => (
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
    const buttonColumns = sounds.map(({name}, column) => (
      <div key={name}>{this.makeColumnOfButtons(column, name)}</div>
    ));
    return buttonColumns;
  }

  advanceBeat() {
    const currentBeat = (this.state.currentBeat + 1) % buttonCols.length;
    for (let i = 0; i < this.state.buttons.length; ++i) {
      const enabled = this.state.buttons[i][currentBeat];
      if (enabled) {
        playSound(i);
      }
    }
    this.setState({currentBeat});
  }

  render() {
    return (
      <div>
        {/*<MySlider />*/}
        <PlayPauseButton onClick={() => this.playPauseBeat()} status={this.state.isPlaying ? 'PAUSE' : 'PLAY'} />
        <div className={'ButtonMatrix'}>
          <ul>{this.makeTableOfButtons()}</ul>
        </div>
      </div>
    );
  }
}

// ========================================

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const promises = sounds.map(({url}, index) => {
  return fetch(url)
    .then(response => {
      return response.arrayBuffer();
    })
    .then(body => {
      return new Promise((resolve, reject) => audioContext.decodeAudioData(body, resolve, reject));
    })
    .then(decoded => {
      sounds[index].buffer = decoded;
    });
});

function playSound(index) {
  const node = audioContext.createBufferSource();
  node.buffer = sounds[index].buffer;
  node.connect(audioContext.destination);
  node.start();
}

Promise.all(promises)
  .then(() => {
    const rootComponent = ReactDOM.render(<Sampler />, document.getElementById('root'));
    // let interval = setInterval(() => rootComponent.advanceBeat(), 200);
    // later, to cancel:
    // clearInterval(interval);
  })
  .catch(err => {
    // TODO: render a "loading failed" component probably
    document.body.innerHTML = `<h1>blurrr some kinda err: ${err}</h1>`;
  });
