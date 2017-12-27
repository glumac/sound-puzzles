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

  render() {
    console.log(this.state.songs);

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
          songsData.songs.map((song, index) => <Song key={song.id} details={this.state.songsData.songs[index]}/>)
        }
      </div>
    );
  }
}

export default App;
