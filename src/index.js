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
          <Slider min={0} max={7} value={value} onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}

class Sampler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: Array(4).fill(Array(8).fill('STOPPED')),
      currentBeat: 0,
    };
    this.handleTrig = this.handleTrig.bind(this);
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
        className={this.state.buttons[column][row] === 'PLAYING' ? 'active' : ''}
        id={this.state.currentBeat === row ? 'currentBeat' : ''}
      />
    ));
    return <ul>{buttons}</ul>;
  }

  handleClick(i, j) {
    let oldState = this.state.buttons;
    var newState = [];
    for (var index = 0; index < oldState.length; index++) {
      newState[index] = oldState[index].slice();
    }
    console.log(newState);
    let buttonToChange = newState[i][j];
    let changedButton = buttonToChange === 'PLAYING' ? 'STOPPED' : 'PLAYING';
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

  handleTrig() {
    this.setState({test: 1});
  }

  renderSamples() {
    return soundUrls.map((url, i) => <Sound key={url} url={url} />);
  }

  advanceBeat() {
    const newValue = (this.state.currentBeat + 1) % 8;
    // console.log(`advancing beat to ${newValue}`);
    this.setState({currentBeat: newValue});
  }

  render() {
    return (
      <div>
        <MySlider />
        <div>
          <ul>{this.makeTableOfButtons()}</ul>
        </div>
        {this.renderSamples()}
      </div>
    );
  }
}

// ========================================

const rootComponent = ReactDOM.render(<Sampler />, document.getElementById('root'));
setInterval(() => rootComponent.advanceBeat(), 250);
