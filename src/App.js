import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Song from './components/Song';
// import Header from './components/Header';
import songsData from './songs-data';

class App extends Component {
  constructor() {
    super();

    this.state = {
      songsData: songsData
    }
  }

  songLoaded = (key) => {
    const songsData = { ...this.state.songsData };
    songsData.songs[key].loaded = true;
    this.setState({ songsData });

    console.log('loadedddd!!');
  };

  render() {
    const context = new (window.AudioContext || window.webkitAudioContext)();

    return (
      <div className="App">
        { /* 
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        */ }

        {
          songsData.songs.map((song, index) => <Song key={index} songKey={index} details={this.state.songsData.songs[index]} context={context} songLoaded={this.songLoaded}/>)
        }
      </div>
    );
  }
}

export default App;
