import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import {soundManager} from 'soundmanager2';

// const buttonCols = [0, 1, 2, 3, 4, 5, 6, 7];
var buttonCols = [];
for (var i = 1; i <= 16; i++) {
  buttonCols.push(i);
}

const buttonRows = ['Sound0', 'Sound1', 'Sound2', 'Sound3', 'Sound4'];
const soundFiles = ['kick 11.wav', 'Hat 27.wav', 'Hat 52.wav', 'Clap 13.wav', 'snare 347.wav'];

class PlayPauseButton extends React.Component {
  constructor() {
    super();
    this.state = {
      status: '>',
    };
  }
  onClick() {}

  render() {
    return (
      <button className={'PlayPauseButton'} onClick={() => this.onClick()}>
        {this.state.status}
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
      buttons: Array(buttonRows.length).fill(Array(buttonCols.length).fill(false)),
      currentBeat: 0,
    };
  }

  makeColumnOfButtons(column, name) {
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
    const buttonColumns = buttonRows.map((name, column) => (
      <div key={name}>{this.makeColumnOfButtons(column, name)}</div>
    ));
    return buttonColumns;
  }

  advanceBeat() {
    const currentBeat = (this.state.currentBeat + 1) % buttonCols.length;
    for (let i = 0; i < this.state.buttons.length; ++i) {
      const enabled = this.state.buttons[i][currentBeat];
      if (enabled) {
        soundManager.play(buttonRows[i]);
      }
    }
    this.setState({currentBeat});
  }

  render() {
    return (
      <div>
        {/*<MySlider />*/}
        <PlayPauseButton />
        <div className={'ButtonMatrix'}>
          <ul>{this.makeTableOfButtons()}</ul>
        </div>
      </div>
    );
  }
}

// ========================================
soundManager.setup({
  onready: () => {
    // load all sounds before rendering
    const promises = buttonRows.map((sound, index) => {
      const url = soundFiles[index];
      return new Promise(function(resolve, reject) {
        soundManager.createSound({
          id: sound,
          url: url,
          autoLoad: true,
          autoPlay: false,
          onload: resolve,
          volume: 100,
        });
      });
    });

    Promise.all(promises).then(() => {
      const rootComponent = ReactDOM.render(<Sampler />, document.getElementById('root'));
      let interval = setInterval(() => rootComponent.advanceBeat(), 125);
      // later, to cancel:
      // clearInterval(interval);
    });
  },
});
