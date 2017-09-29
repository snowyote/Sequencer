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
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      isPlaying: false,
      activeBeat: 0,
      playStatus: Sound.status.STOPPED,
      playFromPosition: 0 /* in milliseconds */,
      onLoading: this.handleSongLoading,
      onPlaying: this.handleSongPlaying,
      onFinishedPlaying: this.handleSongFinishedPlaying,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleFinishedPlaying = this.handleFinishedPlaying.bind(this);
  }

  handleClick() {
    const bool = !this.state.isActive;
    this.setState({
      isActive: bool,
      playFromPosition: 0,
    });
  }

  handleFinishedPlaying() {
    this.setState({playStatus: 'STOPPED'});
    console.log('FINISHED PLAYING');
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.beat === nextProps.activeBeat) {
  //     return true;
  //   }
  //   if (this.state.isActive === nextState.isActive) {
  //     return false;
  //   }
  //   return true;
  // }

  render() {
    let playStatus = this.state.playStatus;
    let position = this.state.position;
    let className = '';
    let id = '';

    if (this.state.isActive) {
      className = 'active';
    }
    if (this.props.activeBeat === this.props.beat) {
      id = 'currentBeat';
    }
    if (this.state.isActive && this.props.activeBeat === this.props.beat) {
      position = 0;
      playStatus = 'PLAYING';
    }

    return (
      <span>
        <button className={className} id={id} onClick={this.handleClick} />
        <Sound
          url={this.props.soundUrl}
          playStatus={playStatus}
          playFromPosition={position}
          onFinishedPlaying={this.handleFinishedPlaying}
          onStop={this.handleStop}
        />
      </span>
    );
  }
}

class ButtonMatrix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('got new props');
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

class SoundPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playStatus: 'STOPPED',
    };
  }

  render() {
    return (
      <Sound
        url={this.props.soundUrl}
        playStatus={this.state.playStatus}
        playFromPosition={0}
        onFinishedPlaying={this.handleFinishedPlaying}
        onStop={this.handleStop}
      />
    );
  }
}

class SoundPlayerGroup extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    const soundPlayers = soundUrls.map(url => (
      <div key={url}>
        <SoundPlayer url={url} />
      </div>
    ));
    return soundPlayers;
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
      value: 0,
    };
  }

  advanceBeat() {
    const newValue = (this.state.value + 1) % 8;
    // console.log(`advancing beat to ${newValue}`);
    this.setState({value: newValue});
  }

  render() {
    return (
      <div>
        <MySlider />
        <ButtonMatrix activeBeat={this.state.value} />
      </div>
    );
  }
}

// ========================================

const rootComponent = ReactDOM.render(<Sampler />, document.getElementById('root'));
setInterval(() => rootComponent.advanceBeat(), 250);
