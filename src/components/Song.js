import React from "react";
import "../style/Song.css";
import songsData from "../songs-data";
import Snippet from "./Snippet";
import { Buffer, SnippetAction, checkIfInOrder, createSnippets, injectStyle, randomTryAgainMessage } from "../helpers.js";
import last from "lodash/last";
import nth from "lodash/nth";

let playTimeout = "",
  playAllSnippets = [],
  playAllNextSnippet,
  actuallyPlayingSnippet,
  stopPlayingTimeout;

class Song extends React.Component {
  constructor(props) {
    super();

    this.state = { 
      details: songsData[props.difficultyLevel][props.songIndex], 
      snippets: createSnippets(songsData[props.difficultyLevel][props.songIndex].numSnippets, songsData[props.difficultyLevel][props.songIndex].snippetSecondsLength, songsData[props.difficultyLevel][props.songIndex].colorPalette), 
      currentlyPlayingSnippet: null, 
      isCurrentlyPlayingAll: false, 
      isLoaded: false, 
      isInCorrectOrder: false, 
      isResetAllowed: false,
      tryAgainMessage: ''
    };
  }

  resetSong = () => {
    const songData = songsData[this.props.difficultyLevel][this.props.songIndex];

    this.setState({
      details: songData,
      snippets: createSnippets(songData.numSnippets, songData.snippetSecondsLength, songData.colorPalette),
      currentlyPlayingSnippet: null,
      isCurrentlyPlayingAll: false,
      isInCorrectOrder: true,
      isResetAllowed: false,
      isImgLoaded: false
    });
  }

  songLoaded = () => {
    this.setState({ isLoaded: true });
  };

  moveSnippet = (dragIndex, hoverIndex) => {
    let snippets = [...this.state.snippets];

    const dragSnippet = snippets[dragIndex];

    snippets.splice(dragIndex, 1);
    snippets.splice(hoverIndex, 0, dragSnippet);

    this.setState({ snippets: snippets });
  };

  stopSnippet = () => {

    this.snippetAction.stop();

    this.setState({ currentlyPlayingSnippet: null });
  };

  setCurrentlyPlayingSnippet = (snippetId, changeActuallyPlayingSnippet) => {
    // console.log('setting current', snippetId);

    if (changeActuallyPlayingSnippet) actuallyPlayingSnippet = snippetId;

    this.setState({ currentlyPlayingSnippet: snippetId }, function() {
      // console.log(this.state.currentlyPlayingSnippet);
    });
  };

  setupSuccessColorBackgroundCSSAnimation = () => {
    const animationArray = ["0% { background: rgb(24,24,24);}"]; 
    const animationIncrementPercent =  100 / this.state.details.colorPalette.length;

    this.state.details.colorPalette.forEach((color, index) => {
      animationArray.push(
        `${Math.floor(animationIncrementPercent * (index + 1))}% { background: ${color};}`
      );
    });

    const keyframes = `@keyframes color-me-in {${animationArray.join('')}`;

    injectStyle(keyframes);
  };

  componentDidMount() {
    this.snippetAction = null;
    this.buffer = new Buffer(
      this.props.context,
      this.state.details.fileName,
      this.songLoaded,
      this.props.songKey
    );
    // this.analyser = this.props.context.createAnalyser();
    this.snippetActionSound = this.buffer.getBuffer();

    this.setupSuccessColorBackgroundCSSAnimation();
  }

  // componentWillUpdate() { console.log('updatingggggg'); // }

  componentWillUnmount() {
    if (this.state.isCurrentlyPlayingAll) 
      this.clearPlayAll(false, true);
        
    if (this.snippetAction) 
      this.stopSnippet();
  }

  playSnippet = details => {
    // console.log(this.state.currentlyPlayingSnippet);

    this.setState({ tryAgainMessage: '' });

    if (this.state.isCurrentlyPlayingAll) {
      this.clearPlayAll(false, true);

      playAllNextSnippet = null;

      clearTimeout(playTimeout);
    } else if (this.state.currentlyPlayingSnippet === details.id) {
      window.clearTimeout(stopPlayingTimeout);

      return this.stopSnippet(details.id);
    } else if (typeof this.state.currentlyPlayingSnippet === "number") {
      // console.log("currentplay", this.state.currentlyPlayingSnippet);

      this.stopSnippet();
    }

    this.snippetAction = new SnippetAction(
      this.props.context,
      this.buffer.getSound(0),
      this.setCurrentlyPlayingSnippet
    );
    // this.snippetAction.play(details.startTime, details.length, null, details.id, true);
    this.snippetAction.play(
      details.startTime,
      details.length,
      null,
      details.id,
      true
    );
  
    stopPlayingTimeout = setTimeout(() => {
      // console.log('stopping music');
      if (this.state.currentlyPlayingSnippet !== details.id) return;

      this.setState({
        currentlyPlayingSnippet: null
      });
    }, details.length * 1000);
  };

  setTrackEndedState = () => {
    this.setState({ 
      isCurrentlyPlayingAll: false,
      isResetAllowed: true
    });

    this.props.goToNextPuzzle();
  }

  clearPlayAll = (orderCheck, stopSnippet) => {
    this.setState({
      currentlyPlayingSnippet: null,
    });

    clearTimeout(playTimeout);

    // console.log(playAllSnippets.length);

    // nth(playAllSnippets, -2).stop();

    if (stopSnippet) {
      this.snippetAction.stop();

      this.setState({ isCurrentlyPlayingAll: false });

      // const secondFromLast = nth(playAllSnippets, -2);

      // if (secondFromLast) secondFromLast.stop();
    }

    if (!orderCheck) return this.snippetAction.stop();

    if (checkIfInOrder(this.state.snippets)) {
      last(playAllSnippets).setListenerForAudioEnd(this.setTrackEndedState);
      // console.log("ITS IN ORDER!!!");

      this.setState({ isInCorrectOrder: true });

      this.props.setSongAsSolved(this.props.difficultyLevel, this.props.songIndex, true);
    } else {
      this.setState({ 
        isCurrentlyPlayingAll: false,
        tryAgainMessage: randomTryAgainMessage()
      });

      setTimeout(() => {
        this.setState({ tryAgainMessage: ''});
      }, 3000);

      this.snippetAction.stop();
    }
  };

  playAll = () => {
    this.setState(
      {
        isCurrentlyPlayingAll: !this.state.isCurrentlyPlayingAll,
        tryAgainMessage: ''
      },
      () => {
        let nextNotetime = this.props.context.currentTime;

        if (!this.state.isCurrentlyPlayingAll) {
          // console.log(playAllSnippets, playAllNextSnippet, playAllSnippets[playAllNextSnippet]);

          this.clearPlayAll(false, true);

          playAllNextSnippet = null;

          return clearTimeout(playTimeout);
        }

        if (typeof this.state.currentlyPlayingSnippet === "number")
          this.snippetAction.stop();

        playAllNextSnippet = 0;

        var snippetsLength = this.state.snippets.length;

        var scheduler = () => {
          var snippet = this.state.snippets[playAllNextSnippet];
          var prevSnippet = this.state.snippets[playAllNextSnippet - 1];

          // console.log(playAllSnippets);

          if (playAllNextSnippet >= snippetsLength) {
            // console.log(playAllSnippets, playAllNextSnippet - 1, playAllSnippets[playAllNextSnippet - 1]);

            // console.log("endind", playAllSnippets, actuallyPlayingSnippet);

            return (playTimeout = window.setTimeout(() => {
              this.clearPlayAll(true, false);
            }, prevSnippet.length * 1000));

            // return playTimeout = window.setTimeout(() => {this.clearPlayAll(true, playAllSnippets[playAllNextSnippet - 1])}, prevSnippet.length * 1000);
          }

          while (nextNotetime < this.props.context.currentTime + 0.1) {
            nextNotetime += snippet.length;

            // console.log(snippet.id + 1, this.state.snippets[playAllNextSnippet + 1].id);

            if ((playAllNextSnippet > 0, playAllSnippets)) {
              // console.log(snippet.id, this.state.snippets[playAllNextSnippet - 1].id);
            }

            if (
              playAllNextSnippet > 0 &&
              snippet.id - 1 ===
                this.state.snippets[playAllNextSnippet - 1].id
            ) {
              //   // console.log(snippet, this.state.snippets[playAllNextSnippet + 1]);
              // console.log( "its the same", playAllSnippets, actuallyPlayingSnippet);

              this.setCurrentlyPlayingSnippet(snippet.id, false);

              // playAllSnippets[playAllNextSnippet - 1].cancelScheduledValues();
            } else {
              playAllSnippets.push(new SnippetAction(this.props.context, this.buffer.getSound(0), this.setCurrentlyPlayingSnippet));

              this.snippetAction = last(playAllSnippets);

              last(playAllSnippets).play(snippet.startTime, null, null, snippet.id, false);

              // stop the previous snippet
              if (playAllSnippets.length > 1) nth(playAllSnippets, -2).stop();
            }

            // console.log(playAllSnippets, actuallyPlayingSnippet);
      
            playAllNextSnippet += 1;
          }

          playTimeout = window.setTimeout(scheduler, 500.0);
        };

        scheduler();
      }
    );
  };

  imgLoaded = () => {
    this.setState({ isImgLoaded: true });
  }

  render() {
    const details = this.state.details;
    const snippets = this.state.snippets
    let button = null;
    let style = {
      animationName: 'color-me-in',
      animationTimingFunction: 'ease-in-out',
      animationDuration: `${details.colorPalette.length * 4}s`,
      animationIterationCount: 'infinite',
      animationDirection: 'normal',
      animationFillMode: 'forwards'
    };
    
    if (this.state.isInCorrectOrder) {
      button = <button className="sp-btn sp-btn--reset" onClick={this.props.goToNextPuzzle}>Next Puzzle</button>;
    } else if (this.state.isResetAllowed) {
      button = <button className="sp-btn sp-btn--reset" onClick={this.resetSong}>Reset</button>;
    } else {
      button = <button className={`sp-btn sp-play-all ${this.state.isCurrentlyPlayingAll ? "sp-play-all--playing" : ""}`} onClick={this.playAll}>
                {this.state.isCurrentlyPlayingAll ? "Playing All" : "Play All"}
              </button>;
    }

    return <div style={this.state.isInCorrectOrder ? style : {}} className={`sp-song ${this.state.isInCorrectOrder ? "sp-song--in-order" : ""}`}>
        <div className={`sp-song-inner ${this.state.isLoaded ? "sp-song-inner--loaded" : ""}`}>
          <div className="sp-music-info">
            <div className="sp-music-img-wrap">
              <a href={details.albumUrl} className="sp-album-link" target="blank">
                <img className={`sp-cover-img ${this.state.isImgLoaded ? "sp-cover-img--loaded" : ""}`} src={details.coverImg} alt="" onLoad={this.imgLoaded} />
              </a>
            </div>
            <div className="sp-music-txt-wrap">
              <h2 className="sp-music-txt-wrap__h2">
                <a className="sp-music-link" href={details.songUrl} target="blank">
                  {details.title}
                </a>
              </h2>
              <h5 className="sp-music-txt-wrap__h5">
                <a className="sp-music-link" href={details.artistUrl} target="blank">
                  {details.artist}
                </a>
              </h5>
            </div>
          </div>
          <div className="sp-snippets-wrap">
            <ul className="sp-snippets">
              {snippets.map((snippet, index) => (
                <Snippet
                  key={snippet.id}
                  index={index}
                  details={snippets[index]}
                  playSnippet={this.playSnippet}
                  isPlaying={
                    this.state.currentlyPlayingSnippet === snippet.id
                  }
                  moveSnippet={this.moveSnippet}
                  snippetAction={this.snippetAction}
                />
              ))}
            </ul>
            {this.state.isInCorrectOrder && <div className="sp-snippets-overlay">
                <h3>You got it!</h3>
              </div>}
          </div>

          {button}

          <div className="sp-msg-wrap">
            {this.state.tryAgainMessage && <div className="sp-msg">
                <a onClick={this.props.goToNextPuzzle}>
                  {this.state.tryAgainMessage}
                </a>
              </div>}
          </div>
        </div>
        {!this.state.isLoaded && <div className="sp-song-loading-overlay">
            <h2>Loading song...</h2>
          </div>}
      </div>;
  }
}

export default Song;
