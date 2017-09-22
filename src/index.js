import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import Sound from 'react-sound';

class FartButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      isPlaying: false,
      activeBeat: 0,
      url: 'http://www.fundmental.com/funpages/wavs/guff.wav',
      playStatus: Sound.status.STOPPED,
      playFromPosition: 300 /* in milliseconds */,
      onLoading: this.handleSongLoading,
      onPlaying: this.handleSongPlaying,
      onFinishedPlaying: this.handleSongFinishedPlaying,
    };
    this.handleClick = this.handleClick.bind(this);
    // this.handleClick = () => this.handleClick()
  }

  handleClick() {
    let oldPlayStatus = this.state.playStatus;
    let newPlayStatus = (playStatus => {
      return playStatus === 'STOPPED' ? 'PLAYING' : 'STOPPED';
    })(oldPlayStatus);
    console.log(oldPlayStatus);
    console.log(newPlayStatus);
    this.setState({
      isActive: !this.state.isActive,
      playStatus: newPlayStatus,
    });
  }

  render() {
    let className = '';
    if (this.state.isActive) {
      className = 'active';
    }
    if (this.state.activeBeat == this.props.beat) {
      className = 'playing';
    }
    return (
      <span>
        <button className={className} onClick={this.handleClick} />
        <Sound url={this.state.url} playStatus={this.state.playStatus} playFromPosition={this.state.playFromPosition} />
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
      buttons: [],
      activeBeat: 0,
      isPlaying: true,
    };
    this.advanceBeat = this.advanceBeat.bind(this);
  }

  componentDidMount() {
    this.addButtons();
    this.startLoop();
  }

  startLoop() {
    setInterval(this.advanceBeat, 1000);
    this.forceUpdate();
  }

  addButtons() {
    const buttonArray = ['Sound0', 'Sound1', 'Sound2', 'Sound3'];
    const buttonColumns = buttonArray.map(name => (
      <div key={name}>
        {this.makeColumnOfButtons(name)}
      </div>
    ));
    this.setState({
      buttons: buttonColumns,
    });
  }

  toggleButton() {
    this.setState({
      isPlaying: true,
    });
  }

  advanceBeat() {
    const newBeat = (this.state.activeBeat + 1) % 8;
    this.setState({activeBeat: newBeat});
    const buttons = this.state.buttons;
    for (var i = 0; i < buttons.length; i++) {
      const thisButton = buttons[i];
      if (thisButton.beat === newBeat) {
        // Highlight this button and, if button is active, play button's sound
      }
    }
  }

  makeColumnOfButtons(name) {
    const buttonArray = ['Beat0', 'Beat1', 'Beat2', 'Beat3', 'Beat4', 'Beat5', 'Beat6', 'Beat7'];
    const buttons = buttonArray.map(beat => <FartButton key={beat + name} beat={beat} />);
    return <ul>{buttons}</ul>;
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.buttons}
        </ul>
      </div>
    );
  }
}

class MySlider extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: 10,
    };
  }

  handleChange = value => {
    this.setState({
      value: value,
    });

    this.props.buttons.setState({
      activeBeat: value,
    });
  };

  render() {
    const {value} = this.state;
    return (
      <div className="slider">
        <Slider min={0} max={100} value={value} onChange={this.handleChange} />
        {this.props.buttons}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<MySlider buttons={<ButtonMatrix />} />, document.getElementById('root'));
