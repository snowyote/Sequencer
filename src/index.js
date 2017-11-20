import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import {soundManager} from 'soundmanager2';

const soundUrls = [
  'http://www.denhaku.com/r_box/ddd1/bass1.wav',
  'http://www.whitenote.dk/Download%20Frame/Whitenote%20Sampels/Slave%20of%20your%20lust/Hi-hat%203.wav',
  'http://www.denhaku.com/r_box/sr16/sr16hat/edge%20hat.wav',
  'http://www.denhaku.com/r_box/sr16/sr16sd/dynohlsn.wav',
];

const buttonCols = [0, 1, 2, 3, 4, 5, 6, 7];
const buttonRows = ['Sound0', 'Sound1', 'Sound2', 'Sound3'];
const soundFiles = {
  Sound0: 'http://www.denhaku.com/r_box/ddd1/bass1.wav',
  Sound1: 'http://www.whitenote.dk/Download%20Frame/Whitenote%20Sampels/Slave%20of%20your%20lust/Hi-hat%203.wav',
  Sound2: 'http://www.denhaku.com/r_box/sr16/sr16hat/edge%20hat.wav',
  Sound3: 'http://www.denhaku.com/r_box/sr16/sr16sd/dynohlsn.wav',
};

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
      currentBeat: 0,
    };
  }

  makeColumnOfButtons(column, name, soundUrl) {
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
      <div key={name}>{this.makeColumnOfButtons(column, name, soundUrls[column])}</div>
    ));
    return buttonColumns;
  }

  advanceBeat() {
    const currentBeat = (this.state.currentBeat + 1) % 8;
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
        <MySlider />
        <div>
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
    const promises = [];
    for (const sound in soundFiles) {
      const url = soundFiles[sound];
      promises.push(
        new Promise(function(resolve, reject) {
          soundManager.createSound({
            id: sound,
            url: url,
            autoLoad: true,
            autoPlay: false,
            onload: resolve,
            volume: 100,
          });
        })
      );
    }

    Promise.all(promises).then(() => {
      const rootComponent = ReactDOM.render(<Sampler />, document.getElementById('root'));
      setInterval(() => rootComponent.advanceBeat(), 1000);
    });
  },
});
