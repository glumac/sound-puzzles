import React, { Component } from 'react';
import './App.css';
import Song from './components/Song';
import Header from './components/Header';
import Footer from "./components/Footer";
import songsData from './songs-data';
import { DragDropContext } from "react-dnd";
import MultiBackend from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/lib/HTML5toTouch";
import { capitalizeFirstLetter } from "./helpers.js";
import Howler from "howler";

const context = new (window.AudioContext || window.webkitAudioContext)();
// const analyser = context.createAnalyser();

// Leveraging Howler.js's mobile audio enabling. Plan to switch addl HTML5 audio code to Howler for max x-browser and device compatability
Howler.mobileAutoEnable = true;

class App extends Component {
  constructor() {
    super();

    this.state = {
      songsData: songsData,
      difficultyLevel: "easy",
      currentSongInLevel: 0,
      areAllSongsSolved: false
    }
  }

  componentWillMount() {
    this.checkLocalStorageForSolved();

    if (this.checkIfAllSolved()) this.setState({ areAllSongsSolved: true });

    this.goToNextPuzzle(); 
  }

  findFirstIncomplete = (level, startingIndex) => {
    const songsAtDifficulty = this.state.songsData[level];
    const levelStartingIndex = startingIndex || 0;
    let firstNotSolvedIndex = null;

    for (let i = levelStartingIndex; i < songsAtDifficulty.length; i++) {
      if (!songsAtDifficulty[i].isSolved) {
        firstNotSolvedIndex = i;

        break;
      }
    }

    return firstNotSolvedIndex;
  };

  goToNextPuzzle = event => {
    if (event) event.preventDefault();

    let nextSong = null;
    let nextLevel = null;

    // check for unsolved puzzles after current puzzle in current level
    nextSong = this.findFirstIncomplete(
      this.state.difficultyLevel,
      this.state.currentSongInLevel
    );

    if (nextSong !== null)
      return this.changeSong(null, this.state.difficultyLevel, nextSong);
    // check for unsolved puzzles after current puzzle in next levels

    // console.log(findIndex(this.state.songsData));

    const levels = Object.keys(this.state.songsData);

    for (let i = 0; i < levels.length; i++) {
      nextSong = this.findFirstIncomplete(levels[i], 0);

      if (nextSong !== null) {
        nextLevel = levels[i];

        this.changeSong(null, nextLevel, nextSong);

        break;
      }
    }
    // check for unsolved puzzles before current puzzle in current level

    // check for unsolved puzzles before current puzzle in prior levels

    // message that everything is solved!!!
  };

  setSongAsSolved = (difficulty, songIndex, setLocalStorage) => {
    let songsData = { ...this.state.songsData };

    // console.log("here", difficulty, songIndex, songsData[difficulty]);

    songsData[difficulty][songIndex].isSolved = true;

    if (setLocalStorage)
      localStorage.setItem(songsData[difficulty][songIndex].id, "solved");

    this.setState({ songsData });

    if (this.checkIfAllSolved())
      this.setState({ areAllSongsSolved: true });
  };

  setDifficulty = (event, level) => {
    event.preventDefault();

    console.log(level);

    // context.close().then(() => {
      // context = new (window.AudioContext || window.webkitAudioContext)();

      this.setState({
        difficultyLevel: level,
        currentSongInLevel: this.findFirstIncomplete(level)
      });
    // });
  };

  checkLocalStorageForSolved = () => {    
    let localStorageSong = null;

    Object.keys(this.state.songsData).map((level, index) => {
      return this.state.songsData[level].map((song, songIndex) => {
        localStorageSong = localStorage.getItem(song.id);
      
        if (localStorageSong === "solved") {
          return this.setSongAsSolved(level, songIndex, false);
        } else {
          return false;
        }
      });
    });
  };

  checkIfAllSolved = () => {
    let areAllSolved = true;

    Object.keys(this.state.songsData).map((level, index) => {
      return this.state.songsData[level].map((song, songIndex) => {
        if (!song.isSolved) {
          return areAllSolved = false;
        } else {
          return true;
        }
      });
    });

    return areAllSolved;
  }

  changeSong = (event, level, songId) => {
    if (event) event.preventDefault();

    // context.close().then(() => {
      // context = new (window.AudioContext || window.webkitAudioContext)();

      this.setState({
        difficultyLevel: level,
        currentSongInLevel: songId
      });
    // });
  }

  resetPuzzles = () => {
    localStorage.clear();

    let songsData = { ...this.state.songsData };

    Object.keys(songsData).map((level, index) => {
      return songsData[level].map((song, songIndex) => {
        return song.isSolved = false;
      });
    });

    this.setState({ 
      songsData: songsData,
      areAllSolved: false 
    }, this.goToNextPuzzle);
  }

  render() {
    return (
      <div className="App">
        <Header />

        <div className="sp-songs">
          <div>
            
            <div className="sp-levels-wrap">
              <div className="sp-levels">
                {/*<span className="sp-levels__label">Difficulty:</span>*/}

                {Object.keys(this.state.songsData).map((level, index) => {
                  return (
                    <div key={level} className="sp-level">
                      <a
                        key={level}
                        className={`sp-level__link ${
                          this.state.difficultyLevel === level
                            ? "sp-level__link--selected"
                            : ""
                        }`}
                        onClick={event => this.setDifficulty(event, level)}
                      >
                        {capitalizeFirstLetter(level)}
                      </a>

                      <div className="sp-level-songs">
                        {this.state.songsData[level].map((song, songIndex) => {
                          return (
                            <div className="sp-level-song-wrap" key={song.id}>
                              <span
                                className={`sp-level-song ${
                                  song.isSolved ? "sp-level-song--solved" : ""
                                } ${
                                  this.state.difficultyLevel === level &&
                                  this.state.currentSongInLevel === songIndex
                                    ? "sp-level-song--current"
                                    : ""
                                }`}
                                onClick={event =>
                                  this.changeSong(event, level, songIndex)
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
              {this.state.areAllSongsSolved && <a className="sp-level sp-level--clear" onClick={this.resetPuzzles}>Reset All</a>}
            </div>

            {Object.keys(this.state.songsData).map(key => {
              // console.log(this.findFirstIncomplete(key));

              if (key === this.state.difficultyLevel) {
                // var firstIncomplete = this.findFirstIncomplete(difficultyLevel);

                return songsData[key].map((song, index) => {
                  if (index === this.state.currentSongInLevel) {
                    return (
                      <Song
                        key={index}
                        songIndex={index}
                        context={context}
                        difficultyLevel={song.difficulty}
                        setSongAsSolved={this.setSongAsSolved}
                        goToNextPuzzle={this.goToNextPuzzle}
                      />
                    );
                  } else {
                    return false;
                  }
                });
              } else {
                return false;
              }
            })}
          </div>
          <div className="sp-instructions">
            <p className="sp-instructions__p">
              Instructions: Click to play the colored sound snippets.
              Drag them into sequence, and "Play All" to see if you have the
              order right!
            </p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default DragDropContext(MultiBackend(HTML5toTouch))(App);
