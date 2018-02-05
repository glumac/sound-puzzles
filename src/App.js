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
import findIndex from "lodash/findIndex";

let context = new (window.AudioContext || window.webkitAudioContext)();


// window.addEventListener(
//   "touchstart",
//   function() {
//     // create empty buffer
//     var buffer = context.createBuffer(1, 1, 22050);
//     var source = context.createBufferSource();
//     source.buffer = buffer;

//     // connect to output (your speakers)
//     source.connect(context.destination);

//     // play the file
//     source.noteOn(0);
//   },
//   false
// );

class App extends Component {
  constructor() {
    super();

    this.state = {
      songsData: songsData,
      difficultyLevel: "easy",
      currentSongInLevel: 0,
    };
  }

  findFirstIncomplete = (level, startingIndex) => {
    const songsAtDifficulty = this.state.songsData[level];
    const levelStartingIndex = levelStartingIndex || 0;
    let firstNotSolvedIndex = null;

    for (let i = levelStartingIndex; i < songsAtDifficulty.length; i++) {
      if (!songsAtDifficulty[i].isSolved) {
        firstNotSolvedIndex = i;

        break;
      }
    }
    // console.log(firstNotSolvedIndex);

    console.log(firstNotSolvedIndex);
    

    return firstNotSolvedIndex;
  };

  goToNextPuzzle = (event) => {
    if (event) event.preventDefault();

    console.log('next level shize');
    
    let nextSong = null;
    let nextLevel = null;
    
    // check for unsolved puzzles after current puzzle in current level
    nextSong = this.findFirstIncomplete(this.state.difficultyLevel, this.state.currentSongInLevel);

    console.log(nextSong);
    
    if (nextSong !== null) return this.changeSong(null, this.state.difficultyLevel, nextSong) 
    // check for unsolved puzzles after current puzzle in next levels 

    // console.log(findIndex(this.state.songsData));

    const levels = Object.keys(this.state.songsData);

    console.log(levels);
    
    
    for (let i = 0; i < levels.length; i++) {
      nextSong = this.findFirstIncomplete(levels[i], 0);

      if (nextSong !== null) {
        nextLevel = levels[i];

        return this.changeSong(null, nextLevel, nextSong);
        break;
      }
    }
    // check for unsolved puzzles before current puzzle in current level

    // check for unsolved puzzles before current puzzle in prior levels

    // message that everything is solved!!!
  };

  setSongAsSolved = (difficulty, songIndex) => {
    let songsData = { ...this.state.songsData };

    console.log("here", difficulty, songIndex, songsData[difficulty]);

    songsData[difficulty][songIndex].isSolved = true;

    this.setState({ songsData });
  };

  setDifficulty = (event, level) => {
    event.preventDefault();

    console.log(level);

    context.close().then(() => {
      context = new (window.AudioContext || window.webkitAudioContext)();

      this.setState({
        difficultyLevel: level,
        currentSongInLevel: this.findFirstIncomplete(level)
      });
    });
  };

  changeSong = (event, level, songId) => {
    if (event) event.preventDefault();

    console.log(event, level, songId);

    context.close().then(() => {
      context = new (window.AudioContext || window.webkitAudioContext)();

      this.setState({
        difficultyLevel: level,
        currentSongInLevel: songId
      });
    });
  };

  render() {
    return (
      <div className="App">
        <Header />

        <div className="sp-songs">
          <div className="sp-levels">
            {/*<span className="sp-levels__label">Difficulty:</span>*/}

            {Object.keys(this.state.songsData).map((level, index) => {
              return (
                <div key={level} className="sp-level">
                  <a
                    key={level}
                    className={`sp-level--link ${
                      this.state.difficultyLevel === level
                        ? "sp-level--link--selected"
                        : ""
                    }`}
                    onClick={event => this.setDifficulty(event, level)}
                  >
                    {capitalizeFirstLetter(level)}
                  </a>

                  <div className="sp-level-songs">
                    {this.state.songsData[level].map(song => {
                      return (
                        <div className="sp-level-song-wrap" key={song.id}>
                          <span
                            className={`sp-level-song ${
                              song.isSolved ? "sp-level-song--solved" : ""
                            } ${
                              this.state.difficultyLevel === level &&
                              this.state.currentSongInLevel === song.id
                                ? "sp-level-song--current"
                                : ""
                            }`}
                            onClick={event =>
                              this.changeSong(event, level, song.id)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {Object.keys(this.state.songsData).map(key => {
            // console.log(this.findFirstIncomplete(key));

            if (key === this.state.difficultyLevel) {
              // var firstIncomplete = this.findFirstIncomplete(difficultyLevel);

              return songsData[key].map((song, index) => {
                if (song.id === this.state.currentSongInLevel) {
                  return (
                    <Song
                      key={song.id}
                      songIndex={song.id}
                      context={context}
                      difficultyLevel={song.difficulty}
                      setSongAsSolved={this.setSongAsSolved}
                      goToNextPuzzle={this.goToNextPuzzle}
                    />
                  );
                }
              });
            }
          })}

          <p className="sp-instructions">
            Instructions: Click to play the colored sound snippets blocks. Drag
            them into sequence, and "Play All" to see if you have the order
            right!
          </p>
        </div>

        <Footer />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);