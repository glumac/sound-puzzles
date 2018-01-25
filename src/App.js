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
import { capitalizeFirstLetter } from "./helpers.js";



let context = new (window.AudioContext || window.webkitAudioContext)();
const levels = ['Easy', 'Medium', 'Hard'];

class App extends Component {
  constructor() {
    super();

    this.state = {
      songsData: songsData,
      difficultyLevel: 'easy',
      currentSongInLevel: 0
    }
  }

  findFirstIncomplete = () => {
    const songsAtDifficulty = this.state.songsData[this.state.difficultyLevel];
    let firstNotSolvedIndex = null;

    for (let i = 0; i, i < songsAtDifficulty.length; i++){
      if (!songsAtDifficulty[i].isSolved) {
        firstNotSolvedIndex = i;

        break;
      }
    }

    // console.log(firstNotSolvedIndex);
    
    return firstNotSolvedIndex;
  }

  setSongAsSolved = (difficulty, songIndex) => {
    let songsData = {...this.state.songsData};

    console.log("here", difficulty, songIndex, songsData[difficulty]);

    songsData[difficulty][songIndex].isSolved = true;
      
    this.setState({ songsData });
  }

  setDifficulty = (event, level) => {
    event.preventDefault();

    console.log(context);

    context.close().then(() => {
      context = new (window.AudioContext || window.webkitAudioContext)();

      this.setState({ difficultyLevel: level.toLowerCase() });
    });
  }

  render() {
    const songIndex = this.findFirstIncomplete();
    const difficultyLevel = this.state.difficultyLevel;

    return <div className="App">
        <Header />

        <div className="sp-songs">
          <div className="sp-levels">
            <span className="sp-levels__label">Difficulty:</span>

            {
              Object.keys(this.state.songsData).map((level, index) => {
                
                return <div key={level} className="sp-level">
                    <a key={level} className={`sp-level--link ${this.state.difficultyLevel === level ? "sp-level--link--selected" : ""}`} onClick={event => this.setDifficulty(event, level)}>
                      {capitalizeFirstLetter(level)}
                    </a>

                    <div className="sp-level-songs">
                      {/*this.state.songsData[level].map(song => {
                        return <span key={song.id} className={`sp-level-song ${song.isSolved ? "sp-level-song--solved" : ""}`} />;
                      })*/}
                    </div>
                  </div>;})}
          </div>

          {Object.keys(this.state.songsData).map(key => {
            console.log(this.findFirstIncomplete(key));
            
            if (key === difficultyLevel) {
              // var firstIncomplete = this.findFirstIncomplete(difficultyLevel); 

              return songsData[key].map((song, index) => {
                console.log(song.title);
                if (song.id === this.state.currentSongInLevel) {
                  return <Song key={song.id} songIndex={song.id} context={context} difficultyLevel={song.difficulty} setSongAsSolved={this.setSongAsSolved} />;
                }
              });
            }
          })}

          <p className="sp-instructions">
            Instructions: Click to play the sound snippets blocks. Drag them
            into sequence, and "Play All" to see if you have the order
            right!
          </p>
        </div>

        <Footer />
      </div>;
  }
}

export default DragDropContext(HTML5Backend)(App);