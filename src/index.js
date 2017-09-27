import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import Sound from 'react-sound';

class SampleButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      isPlaying: false,
      activeBeat: 0,
      // url: {this.props.soundUrl},
      playStatus: Sound.status.STOPPED,
      playFromPosition: 300 /* in milliseconds */,
      onLoading: this.handleSongLoading,
      onPlaying: this.handleSongPlaying,
      onFinishedPlaying: this.handleSongFinishedPlaying,
    };
    this.handleClick = this.handleClick.bind(this);
    // this.handleClick = () => this.handleClick()
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(`old props: ${this.props}`);
    console.log(`new props: ${nextProps}`);
    if (this.props !== nextProps) {
      return true;
    }
    if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  handleClick() {
    let oldPlayStatus = this.state.playStatus;
    let newPlayStatus = (playStatus => {
      return playStatus === 'STOPPED' ? 'PLAYING' : 'STOPPED';
    })(oldPlayStatus);
    this.setState({
      isActive: !this.state.isActive,
      // playStatus: newPlayStatus,
    });
  }

  render() {
    let className = '';
    let playStatus = 'STOPPED';
    if (this.state.isActive) {
      className = 'active';
    }
    if (this.props.activeBeat === this.props.beat) {
      className = 'playing';
    }
    if (this.state.isActive && this.props.activeBeat === this.props.beat) {
      playStatus = 'PLAYING';
    }
    return (
      <span>
        <button className={className} onClick={this.handleClick} />
        <Sound url={this.props.soundUrl} playStatus={playStatus} playFromPosition={this.state.playFromPosition} />
      </span>
    );
  }
}

class BeatClock extends React.Component {
  constructor() {
    super();
    this.state = {
      activeBeat: 0,
    };
  }
}

class ButtonMatrix extends React.Component {
  constructor() {
    super();
    this.state = {
      isPlaying: true,
    };
  }

  makeTableOfButtons() {
    const buttonArray = ['Sound0', 'Sound1', 'Sound2', 'Sound3'];
    const soundUrls = [
      'http://www.denhaku.com/r_box/ddd1/bass1.wav',
      'http://www.whitenote.dk/Download%20Frame/Whitenote%20Sampels/Slave%20of%20your%20lust/Hi-hat%203.wav',
      'http://www.denhaku.com/r_box/sr16/sr16hat/edge%20hat.wav',
      'http://www.denhaku.com/r_box/sr16/sr16sd/dynohlsn.wav',
    ];
    const buttonColumns = buttonArray.map((name, i) => (
      <div key={name}>{this.makeColumnOfButtons(name, soundUrls[i])}</div>
    ));
    return buttonColumns;
  }

  toggleButton() {
    this.setState({
      isPlaying: true,
    });
  }

  makeColumnOfButtons(name, soundUrl) {
    const buttonArray = [0, 1, 2, 3, 4, 5, 6, 7];
    const buttons = buttonArray.map((beat, i) => (
      <SampleButton key={beat + name} beat={beat} activeBeat={this.props.activeBeat} soundUrl={soundUrl} />
    ));
    return <ul>{buttons}</ul>;
  }

  render() {
    return (
      <div>
        <ul>{this.makeTableOfButtons()}</ul>
      </div>
    );
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

  advanceBeat() {
    const newValue = (this.state.value + 1) % 8;
    console.log(`advancing beat to ${newValue}`);
    this.setState({value: newValue});
  }

  render() {
    const {value} = this.state;
    return (
      <div>
        <div />
        <div className="slider">
          <Slider min={0} max={7} value={value} onChange={this.handleChange} />
          <ButtonMatrix activeBeat={this.state.value} />
        </div>
      </div>
    );
  }
}

// ========================================

const rootComponent = ReactDOM.render(<MySlider />, document.getElementById('root'));
// setInterval(() => rootComponent.advanceBeat(), 175);
