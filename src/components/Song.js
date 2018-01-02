import React from 'react';
import Snippet from './Snippet'
// import logo  from './logo.svg';
// import ReactAudioPlayer from 'react-audio-player';
// import Sound from 'react-sound';
import { Buffer } from '../helpers.js';
import { SnippetAction } from '../helpers.js';

let playTimeout = function () { };

class Song extends React.Component {
  constructor() {
    super();

    this.state = {
      currentlyPlayingSnippet: null,
      currentlyPlayingAll: false,
      position: 0
    };
  }

  stopSnippet = (snippetId) => {
    console.log('stopping');

    this.snippetAction.stop();
  
    this.setState({
      currentlyPlayingSnippet: null,
    }, function () {
      // console.log(this.state);
    }); 
  }

  setCurrentlyPlayingSnippet = (snippetId) => {
    this.setState({
      currentlyPlayingSnippet: snippetId
      // position: details.startTime
    })
  }

  componentDidMount() {
    this.snippetAction = null;
    this.nextNotetime = this.props.context.currentTime;
    this.timerID = null;

    this.buffer = new Buffer(this.props.context, this.props.details.fileName, this.props.songLoaded, this.props.songKey);
    this.snippetActionSound = this.buffer.getBuffer();
  }

  // componentWillUpdate() {
  //   console.log('updatingggggg');    
  // }

  playSnippet = (details) => {
    let playing = false;
    var stopPlayingTimeout;

    console.log(window);

    if (this.state.currentlyPlayingSnippet === details.id) {
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

  clearPlayAll = () => {
    this.setState({
      currentlyPlayingSnippet: null,
      currentlyPlayingAll: false
    });
  }


  playAll = () => {
    this.setState({
      currentlyPlayingAll: !this.state.currentlyPlayingAll
    }, () => {
      console.log(playTimeout);

      let nextNotetime = this.props.context.currentTime;

      if ( !this.state.currentlyPlayingAll ) {
        return;

        // return this.audioElem.pause();

        // clearTimeout(playTimeout);
      }

      // this.props.details.snippets.map((snippet, index) => {
      //   var snippetAction = new SnippetAction(this.props.context, this.buffer.getSound(0));

      //   snippetAction.play(snippet.startTime, snippet.length, index * 3);
      // })

      var nextSnippet = 0;
      var snippetsLength = this.props.details.snippets.length;
      var allSnippets = [];

      var scheduler = () => {
        var snippet = this.props.details.snippets[nextSnippet];

        // console.log('scheduler', nextSnippet. snippet);

        if (nextSnippet >= snippetsLength) {
          this.clearPlayAll();

          return false;
        }

        while (nextNotetime < this.props.context.currentTime) {
          nextNotetime += snippet.length + .005;
          // console.log(nextNotetime);

          // var nextSnippet = typeof this.state.currentlyPlayingSnippet === 'number' ? this.state.currentlyPlayingSnippet + 1 : 0;

          allSnippets[nextSnippet] = new SnippetAction(this.props.context, this.buffer.getSound(0), this.setCurrentlyPlayingSnippet);
          allSnippets[nextSnippet].play(snippet.startTime, snippet.length, null, snippet.id);

          if (nextSnippet > 0) allSnippets[nextSnippet - 1].stop();

          nextSnippet += 1;

          //   //   // console.log(nextNotetime, this.props.context.currentTime + 0.1);

          //   nextNotetime += 0.5;
          //   console.log(nextNotetime);
          // })
        }

        // console.log(nextNotetime, this.props.context.currentTime + 0.1, snippet.length, snippet.id,  snippetsLength);

        window.setTimeout(scheduler, 100.0);
      };

      scheduler();    
    });
  };

  render(){ 
    const details = this.props.details;
    return (
      <div className="sp-song">
        { /* individual song challenge goes here */ }
        <h1><a href={details.songUrl} target="blank">{details.title}</a> - <a href={details.artistUrl} target="blank">{details.artist}</a></h1>
        <ul className="sp-snippets">

        {
          details.snippets.map((snippet, index) => <Snippet key={snippet.id} details={details.snippets[index]} playSnippet={this.playSnippet} isPlaying={this.state.currentlyPlayingSnippet == snippet.id}/>)
        }
        </ul>

        <button className={`sp-btn sp-play-all ${this.state.currentlyPlayingAll ? 'sp-play-all--playing' : ''}`} onClick={this.playAll}>{this.state.currentlyPlayingAll ? 'Playing' :  'Play All'}</button>

        <div className={`sp-song-loading-overlay ${details.loaded ? 'loaded' : 'loading'}`}>
          <h2>Loading song...</h2>
        </div>

        

      </div>
    )
  }
}

export default Song;