import React from 'react';
import Snippet from './Snippet'
import { Buffer, SnippetAction, checkIfInOrder } from '../helpers.js';

let playTimeout = '';
let playAllSnippets = {};
let playAllNextSnippet;

class Song extends React.Component {
  constructor() {
    super();

    // TO DO - move these to app state on song in array
    this.state = {
      currentlyPlayingSnippet: null,
      currentlyPlayingAll: false,
      position: 0,
      isInCorrectOrder: false
    };
  }

  stopSnippet = () => {
    console.log('stopping');

    this.snippetAction.stop(null, .2);
  
    this.setState({
      currentlyPlayingSnippet: null,
    }, function () {}); 
  }

  setCurrentlyPlayingSnippet = (snippetId) => {
    this.setState({
      currentlyPlayingSnippet: snippetId
    })
  }

  componentDidMount() {
    this.snippetAction = null;
    this.nextNotetime = this.props.context.currentTime;
    this.timerID = null;

    this.buffer = new Buffer(this.props.context, this.props.details.fileName, this.props.songLoaded,this.props.songKey);
    this.snippetActionSound = this.buffer.getBuffer();
  }

  // componentWillUpdate() { console.log('updatingggggg'); // }

  playSnippet = (details) => {
    let playing = false;
    var stopPlayingTimeout;

    if (this.state.currentlyPlayingAll) {
        const snippetToStop = playAllSnippets[playAllNextSnippet - 1];

        if (snippetToStop) snippetToStop.stop(null, .2);

        this.clearPlayAll();

        playAllNextSnippet = null;

        console.log("CLEAR THE TIMEOUT");

        return clearTimeout(playTimeout);
    } else if (this.state.currentlyPlayingSnippet === details.id) {
      console.log('stoppingasfasdfaasdfasdfadsf');
      window.clearTimeout(stopPlayingTimeout);
      playing = false;
      return this.stopSnippet(details.id);
    } 

    // console.log('currentplay', this.state.currentlyPlayingSnippet);

    if (typeof this.state.currentlyPlayingSnippet === 'number') {
      console.log('currentplay', this.state.currentlyPlayingSnippet);
      
      this.stopSnippet(this.state.currentlyPlayingSnippet);
    } 

    // this.audioElem.currentTime = details.startTime;
    // console.log('CONTEXTTTTTTTTT', this.props.context);

    this.snippetAction = new SnippetAction(this.props.context, this.buffer.getSound(0), this.setCurrentlyPlayingSnippet);
    this.snippetAction.play(details.startTime, details.length, null, details.id);
    
    playing = true;

    // stopPlayingTimeout = window.setTimeout(function () { console.log("Hello"); }, details.length * 1000);

    var stopPlayingTimeout = setTimeout(() => {
      console.log('stopping music');
      if (!playing || this.state.currentlyPlayingSnippet !== details.id) return;

      this.setState({
        currentlyPlayingSnippet: null,
      })
    }, details.length * 1000);
  };

  // window.setInterval(scheduler, 50.0);

  clearPlayAll = (orderCheck) => {
    console.log('clearingplayall', Date.now());
    
    this.setState({
      currentlyPlayingSnippet: null,
      currentlyPlayingAll: false
    });

    if (!orderCheck) return;

    if (checkIfInOrder(this.props.details.snippets)) {
      console.log('ITS IN ORDER!!!');
      this.setState({
        isInCorrectOrder: true
      });
    }
  }

  playAll = () => {
    this.setState({
      currentlyPlayingAll: !this.state.currentlyPlayingAll
    }, () => {

      console.log(checkIfInOrder(this.props.details.snippets));

      let nextNotetime = this.props.context.currentTime;
      
      if ( !this.state.currentlyPlayingAll ) {
        console.log(playAllSnippets, playAllNextSnippet, playAllSnippets[playAllNextSnippet]);

        const snippetToStop = playAllSnippets[playAllNextSnippet - 1];

        if (snippetToStop) snippetToStop.stop(); 

        this.clearPlayAll();

        playAllNextSnippet = null;

        console.log("CLEAR THE TIMEOUT");

        return clearTimeout(playTimeout);
        // return this.audioElem.pause();
      }

      console.log(this.state.currentlyPlayingSnippet, this.state.currentlyPlayingSnippet > -1);

      if (typeof this.state.currentlyPlayingSnippet === 'number') this.stopSnippet(this.state.currentlyPlayingSnippet);

      playAllNextSnippet = 0;
      var snippetsLength = this.props.details.snippets.length;
      

      var scheduler = () => {
        var snippet = this.props.details.snippets[playAllNextSnippet];
        var prevSnippet = this.props.details.snippets[playAllNextSnippet -1];

        // console.log('scheduler', playAllNextSnippet. snippet);

        // console.log(playAllNextSnippet >= snippetsLength);

        if (playAllNextSnippet >= snippetsLength ) {
          console.log("here", prevSnippet.length);

          console.log("scheduleing clearingplayall", Date.now());

          return playTimeout = window.setTimeout(() => {this.clearPlayAll(true)}, prevSnippet.length * 1000);
        }

        while (nextNotetime < this.props.context.currentTime) {
          nextNotetime += snippet.length + .005;
          // console.log(nextNotetime);

          // var playAllNextSnippet = typeof this.state.currentlyPlayingSnippet === 'number' ? this.state.currentlyPlayingSnippet + 1 : 0;f

          playAllSnippets[playAllNextSnippet] = new SnippetAction(this.props.context, this.buffer.getSound(0), this.setCurrentlyPlayingSnippet);
          playAllSnippets[playAllNextSnippet].play(snippet.startTime, snippet.length, null, snippet.id);

          // console.log(playAllSnippets, this.state.currentlyPlayingSnippet), playAllSnippets[this.state.currentlyPlayingSnippet];

          if (playAllNextSnippet > 0) playAllSnippets[playAllNextSnippet - 1].stop();

          playAllNextSnippet += 1;

          //   //   // console.log(nextNotetime, this.props.context.currentTime + 0.1);

          //   nextNotetime += 0.5;
          //   console.log(nextNotetime);
          // })
        }

        // console.log(nextNotetime, this.props.context.currentTime + 0.1, snippet.length, snippet.id,  snippetsLength);

        playTimeout = window.setTimeout(scheduler, 100.0);

        // console.log(playTimeout);
      };

      scheduler();    
    });
  };

  render(){ 
    const details = this.props.details;
    return <div className={`sp-song ${this.state.isInCorrectOrder ? "sp-song--in-order" : ""}`}>
      {/* individual song challenge goes here */}
      <h1>
        <a href={details.songUrl} target="blank">
          {details.title}
        </a> - <a href={details.artistUrl} target="blank">
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
              isPlaying={this.state.currentlyPlayingSnippet == snippet.id}
              moveSnippet={this.props.moveSnippet}
            />
          ))}
        </ul>
        {this.state.isInCorrectOrder && <div className="sp-snippets-overlay">
            <h3>You got it!</h3>
          </div>}
      </div>
      <button className={`sp-btn sp-play-all ${this.state.currentlyPlayingAll ? "sp-play-all--playing" : ""}`} onClick={this.playAll}>
        {this.state.currentlyPlayingAll ? "Playing All" : "Play All"}
      </button>

      {!details.loaded && 
        <div className="sp-song-loading-overlay">
          <h2>Loading song...</h2>
        </div>}
    </div>
  }
}

export default Song;