import React from 'react';
import songsData from "../songs-data";
import Snippet from './Snippet'
import { Buffer, SnippetAction, checkIfInOrder } from '../helpers.js';
import last from "lodash/last";
import nth from "lodash/nth";


let playTimeout = '',
    playAllSnippets = [],
    playAllNextSnippet,
    actuallyPlayingSnippet,
    stopPlayingTimeout;

class Song extends React.Component {
  constructor(props) {
    super();

    // TO DO - move these to app state on song in array
    this.state = {
      details: songsData.songs[props.songIndex],
      currentlyPlayingSnippet: null,
      isCurrentlyPlayingAll: false,
      isLoaded: false,
      isInCorrectOrder: false
    };
  }

  songLoaded = () => {
    this.setState({ isLoaded: true });

    // console.log('loadedddd!!');
  };

  moveSnippet = (dragIndex, hoverIndex) => {
    const songData = { ...this.state.details };

    // const { cards } = this.state.songData.songs[0].snippets;

    // console.log(cards);

    const dragSnippet = songData.snippets[dragIndex];

    songData.snippets.splice(dragIndex, 1);
    songData.snippets.splice(hoverIndex, 0, dragSnippet);

    this.setState({ details: songData });

    // this.setState(
    //   update(this.state, {
    //     cards: {
    //       $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
    //     },
    //   }),
    // )
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

  componentDidMount() {
    this.snippetAction = null;
    this.buffer = new Buffer(
      this.props.context,
      this.state.details.fileName,
      this.songLoaded,
      this.props.songKey
    );
    this.snippetActionSound = this.buffer.getBuffer();
  }

  // componentWillUpdate() { console.log('updatingggggg'); // }

  playSnippet = details => {
    // console.log(this.state.currentlyPlayingSnippet);

    if (this.state.isCurrentlyPlayingAll) {

      this.clearPlayAll(false, true);

      playAllNextSnippet = null;

      console.log("CLEAR THE TIMEOUT");

      clearTimeout(playTimeout);
    } else if (this.state.currentlyPlayingSnippet === details.id) {
      console.log("stoppingasfasdfaasdfasdfadsf");
      window.clearTimeout(stopPlayingTimeout);

      return this.stopSnippet(details.id);
    } else if (typeof this.state.currentlyPlayingSnippet === "number") {
      console.log("currentplay", this.state.currentlyPlayingSnippet);

      this.stopSnippet(this.state.currentlyPlayingSnippet);
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

    var stopPlayingTimeout = setTimeout(() => {
      // console.log('stopping music');
      if (this.state.currentlyPlayingSnippet !== details.id) return;

      this.setState({
        currentlyPlayingSnippet: null
      });
    }, details.length * 1000);
  };

  clearPlayAll = (orderCheck, stopSnippet) => {
    this.setState({
      currentlyPlayingSnippet: null,
      isCurrentlyPlayingAll: false
    });

    console.log(playAllSnippets.length);

    // nth(playAllSnippets, -2).stop();

    if (stopSnippet) {
      last(playAllSnippets).stop();

      // const secondFromLast = nth(playAllSnippets, -2);

      // if (secondFromLast) secondFromLast.stop();
    }

    if (!orderCheck) return;

    if (checkIfInOrder(this.state.details.snippets)) {
      console.log("ITS IN ORDER!!!");
      // snippetToStop.stop();
      this.setState({
        isInCorrectOrder: true
      });
    }
  };

  playAll = () => {
    this.setState(
      {
        isCurrentlyPlayingAll: !this.state.isCurrentlyPlayingAll
      },
      () => {
        let nextNotetime = this.props.context.currentTime;

        if (!this.state.isCurrentlyPlayingAll) {
          console.log(
            playAllSnippets, playAllNextSnippet, playAllSnippets[playAllNextSnippet]
          );

          // const snippetToStop = playAllSnippets[actuallyPlayingSnippet];

          // if (snippetToStop) snippetToStop.stop();

          this.clearPlayAll(false, true);

          playAllNextSnippet = null;

          console.log("CLEAR THE TIMEOUT");

          return clearTimeout(playTimeout);
          // return this.audioElem.pause();d
        }

        // console.log(this.state.currentlyPlayingSnippet, this.state.currentlyPlayingSnippet > -1);

        if (typeof this.state.currentlyPlayingSnippet === "number")
          this.stopSnippet(this.state.currentlyPlayingSnippet);

        playAllNextSnippet = 0;

        var snippetsLength = this.state.details.snippets.length;

        var scheduler = () => {
          var snippet = this.state.details.snippets[playAllNextSnippet];
          var prevSnippet = this.state.details.snippets[playAllNextSnippet - 1];

          // console.log(playAllSnippets);

          if (playAllNextSnippet >= snippetsLength) {
            // console.log(playAllSnippets, playAllNextSnippet - 1, playAllSnippets[playAllNextSnippet - 1]);

            console.log("endind", playAllSnippets, actuallyPlayingSnippet);

            return (playTimeout = window.setTimeout(() => {
              this.clearPlayAll(false, true);
            }, prevSnippet.length * 1000));

            // return playTimeout = window.setTimeout(() => {this.clearPlayAll(true, playAllSnippets[playAllNextSnippet - 1])}, prevSnippet.length * 1000);
          }

          while (nextNotetime < this.props.context.currentTime + 0.1) {
            nextNotetime += snippet.length;

            // console.log(snippet.id + 1, this.state.details.snippets[playAllNextSnippet + 1].id);

            if ((playAllNextSnippet > 0, playAllSnippets)) {
              // console.log(snippet.id, this.state.details.snippets[playAllNextSnippet - 1].id);
            }

            if (playAllNextSnippet > 0 && snippet.id -1 === this.state.details.snippets[playAllNextSnippet - 1].id) {
              //   // console.log(snippet, this.state.details.snippets[playAllNextSnippet + 1]);
              console.log("its the same", playAllSnippets, actuallyPlayingSnippet);

              this.setCurrentlyPlayingSnippet(snippet.id, false);

              // playAllSnippets[playAllNextSnippet - 1].cancelScheduledValues();
            } else {

              playAllSnippets.push(new SnippetAction(
                this.props.context,
                this.buffer.getSound(0),
                this.setCurrentlyPlayingSnippet
              ));
              
              last(playAllSnippets).play(
                snippet.startTime,
                null,
                null,
                snippet.id,
                false
              );

              // stop the previous snippet
              if (playAllSnippets.length > 1) nth(playAllSnippets, -2).stop();
            }

            console.log(playAllSnippets, actuallyPlayingSnippet);


            // why doesnt prevSnippet work here?

            // console.log('logging');

            playAllNextSnippet += 1;
          }

          playTimeout = window.setTimeout(scheduler, 500.0);
        };

        scheduler();
      }
    );
  };

  render() {
    const details = this.state.details;
    return (
      <div
        className={`sp-song ${
          this.state.isInCorrectOrder ? "sp-song--in-order" : ""
        }`}
      >
        {/* individual song challenge goes here */}
        <h1>
          <a href={details.songUrl} target="blank">
            {details.title}
          </a>{" "}
          -{" "}
          <a href={details.artistUrl} target="blank">
            {details.artist}
          </a>
        </h1>
        <div className="sp-snippets-wrap">
          <ul className="sp-snippets">
            {details.snippets.map((snippet, index) => (
              <Snippet
                key={snippet.id}
                index={index}
                details={details.snippets[index]}
                playSnippet={this.playSnippet}
                isPlaying={this.state.currentlyPlayingSnippet === snippet.id}
                moveSnippet={this.moveSnippet}
              />
            ))}
          </ul>
          {this.state.isInCorrectOrder && (
            <div className="sp-snippets-overlay">
              <h3>You got it!</h3>
            </div>
          )}
        </div>
        <button
          className={`sp-btn sp-play-all ${
            this.state.isCurrentlyPlayingAll ? "sp-play-all--playing" : ""
          }`}
          onClick={this.playAll}
        >
          {this.state.isCurrentlyPlayingAll ? "Playing All" : "Play All"}
        </button>

        {!this.state.isLoaded && (
          <div className="sp-song-loading-overlay">
            <h2>Loading song...</h2>
          </div>
        )}
      </div>
    );
  }
}

export default Song;