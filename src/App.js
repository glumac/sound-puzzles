import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Song from './components/Song';
import Header from './components/Header';
import Footer from "./components/Footer";
import songsData from './songs-data';
// import update from 'immutability-helper';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const context = new (window.AudioContext || window.webkitAudioContext)();

class App extends Component {
  constructor() {
    super();

    // this.state = {
    //   songsData: songsData
    // }
  }
  render() {
    return <div className="App">
        <Header />

        <div className="sp-songs">
          {songsData.songs.map((song, index) => (
            <Song
              key={index}
              songIndex={index}
              context={context}
            />
          ))}

          <p className="sp-instructions">
            Instructions: Click to play the sound snippets blocks.
            Drag them into sequence, and "Play All" to see if you have the
            order right!
          </p>
        </div>

        <Footer />
      </div>;
  }
}

export default DragDropContext(HTML5Backend)(App);
