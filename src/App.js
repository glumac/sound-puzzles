import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Song from './components/Song';
import Header from './components/Header';
import Footer from "./components/Footer";
import songsData from './songs-data';
import update from 'immutability-helper';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


const context = new (window.AudioContext || window.webkitAudioContext)();

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

  moveSnippet = (dragIndex, hoverIndex) => {
    const songsData = { ...this.state.songsData };

    // const { cards } = this.state.songsData.songs[0].snippets;

    // console.log(cards);

    const dragSnippet = songsData.songs[0].snippets[dragIndex];


    songsData.songs[0].snippets.splice(dragIndex, 1);
    songsData.songs[0].snippets.splice(hoverIndex, 0, dragSnippet);
    
    

    this.setState({songsData});

    // this.setState(
    //   update(this.state, {
    //     cards: {
    //       $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
    //     },
    //   }),
    // )
  }

  render() {
    return <div className="App">
        {/* 
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        */}
        <Header />

        <div className="sp-songs">
          {songsData.songs.map((song, index) => (
            <Song
              key={index}
              songKey={index}
              details={this.state.songsData.songs[index]}
              context={context}
              songLoaded={this.songLoaded}
              moveSnippet={this.moveSnippet}
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
