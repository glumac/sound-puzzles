import React from 'react';
import Snippet from './Snippet'
import { Buffer, SnippetAction, checkIfInOrder } from '../helpers.js';

let playTimeout = '',
    playAllSnippets = {},
    playAllNextSnippet,
    stopPlayingTimeout;

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
    this.snippetAction.stop();
  
    this.setState({ currentlyPlayingSnippet: null }); 
  }

  setCurrentlyPlayingSnippet = snippetId => {
    // console.log('setting current', snippetId);
    
    this.setState({ currentlyPlayingSnippet: snippetId }, function(){
      // console.log(this.state.currentlyPlayingSnippet);
    })
  };

  componentDidMount() {
    this.snippetAction = null;
    this.buffer = new Buffer(this.props.context, this.props.details.fileName, this.props.songLoaded,this.props.songKey);
    this.snippetActionSound = this.buffer.getBuffer();
  }

  // componentWillUpdate() { console.log('updatingggggg'); // }

  playSnippet = (details) => {
    console.log(this.state.currentlyPlayingSnippet);
  
    if (this.state.currentlyPlayingAll) {
      const snippetToStop = playAllSnippets[playAllNextSnippet - 1];

      // if (snippetToStop) snippetToStop.stop(null, .2);

      this.clearPlayAll(false, snippetToStop);

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

    this.snippetAction = new SnippetAction(this.props.context, this.buffer.getSound(0), this.setCurrentlyPlayingSnippet);
    // this.snippetAction.play(details.startTime, details.length, null, details.id, true);
    this.snippetAction.play(details.startTime, details.length, null, details.id, true);
    
    var stopPlayingTimeout = setTimeout(() => {
      // console.log('stopping music');
      if (this.state.currentlyPlayingSnippet !== details.id) return;

      this.setState({
        currentlyPlayingSnippet: null,
      })
    }, details.length * 1000);
  };

  clearPlayAll = (orderCheck, snippetToStop) => {
    
    this.setState({
      currentlyPlayingSnippet: null,
      currentlyPlayingAll: false
    });

    if (!orderCheck) return snippetToStop.stop();

    if (checkIfInOrder(this.props.details.snippets)) {
      console.log('ITS IN ORDER!!!');
      // snippetToStop.stop();
      this.setState({
        isInCorrectOrder: true
      });
    } else {
      snippetToStop.stop();
    }
  }

  playAll = () => {
    this.setState({
      currentlyPlayingAll: !this.state.currentlyPlayingAll
    }, () => {

      let nextNotetime = this.props.context.currentTime;
      
      if ( !this.state.currentlyPlayingAll ) {
        console.log(playAllSnippets, playAllNextSnippet, playAllSnippets[playAllNextSnippet]);

        const snippetToStop = playAllSnippets[playAllNextSnippet - 1];

        // if (snippetToStop) snippetToStop.stop(); 

        this.clearPlayAll(null, snippetToStop);

        playAllNextSnippet = null;

        console.log("CLEAR THE TIMEOUT");

        return clearTimeout(playTimeout);
        // return this.audioElem.pause();d
      }

      // console.log(this.state.currentlyPlayingSnippet, this.state.currentlyPlayingSnippet > -1);

      if (typeof this.state.currentlyPlayingSnippet === 'number') this.stopSnippet(this.state.currentlyPlayingSnippet);

      playAllNextSnippet = 0;
      
      var snippetsLength = this.props.details.snippets.length;
      
      var scheduler = () => {
        var snippet = this.props.details.snippets[playAllNextSnippet];
        var prevSnippet = this.props.details.snippets[playAllNextSnippet -1];

        console.log(playAllSnippets);

        if (playAllNextSnippet >= snippetsLength ) {
          // console.log(playAllSnippets, playAllNextSnippet - 1, playAllSnippets[playAllNextSnippet - 1]);

          return playTimeout = window.setTimeout(() => {this.clearPlayAll(false, playAllSnippets[playAllNextSnippet - 1])}, prevSnippet.length * 1000);

          // return playTimeout = window.setTimeout(() => {this.clearPlayAll(true, playAllSnippets[playAllNextSnippet - 1])}, prevSnippet.length * 1000);
        }

        while (nextNotetime < this.props.context.currentTime + 0.1) {
          nextNotetime += snippet.length;

          // console.log(snippet.id + 1, this.props.details.snippets[playAllNextSnippet + 1].id);
          
          if (playAllNextSnippet > 0) {
            console.log(snippet.id, this.props.details.snippets[playAllNextSnippet - 1].id);
            
          }

          if (playAllNextSnippet > 0 && snippet.id -1 === this.props.details.snippets[playAllNextSnippet - 1].id) {
            //   // console.log(snippet, this.props.details.snippets[playAllNextSnippet + 1]);
            console.log("its the same");

            // this.setCurrentlyPlayingSnippet(snippet.id);

            // playAllSnippets[playAllNextSnippet - 1].cancelScheduledValues();
          } 

            playAllSnippets[playAllNextSnippet] = new SnippetAction(this.props.context, this.buffer.getSound(0), this.setCurrentlyPlayingSnippet);
            playAllSnippets[playAllNextSnippet].play(snippet.startTime, null, null, snippet.id, false);

            // why doesnt prevSnippet work here?
            if (playAllNextSnippet > 0) playAllSnippets[playAllNextSnippet - 1].stop();

       



          // console.log('logging');

          playAllNextSnippet += 1;
        }

        playTimeout = window.setTimeout(scheduler, 500.0);
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