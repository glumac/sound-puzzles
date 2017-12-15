import React from 'react';
import Snippet from './Snippet'
// import logo  from './logo.svg';
// import ReactAudioPlayer from 'react-audio-player';
import Sound from 'react-sound';
// import { randomFromArray } from '../helpers.js';

class Song extends React.Component {
  constructor() {
    super();

    this.state = {
      currentlyPlayingSnippet: null,
      currentlyPlayingAll: false,
      position: 0, 
      playStatus: Sound.status.STOPPED
    };
  }

  stopSnippet = (snippetId) => {
    console.log('stopping');

    this.audioElem.pause();

    this.setState({
      currentlyPlayingSnippet: null,
    }, function () {
      console.log(this.state);
    });
  }

  playSnippet = (details) => {
    if (this.state.currentlyPlayingSnippet == details.id) {
      return this.stopSnippet(details.id);
    } 

    this.audioElem.currentTime = details.startTime;
    this.audioElem.play()

    console.log(details, 'audiooo',  this.audioElem.currentTime);


    this.setState({
      currentlyPlayingSnippet: details.id,
      position: details.startTime

    }, function(){
      // console.log(this.state.position);
    });


    const listenForPause = (event) => {
      const pauseTime = details.endTime;

      console.log(event.target.currentTime, pauseTime);

      if (event.target.currentTime >= pauseTime) {
        console.log('pausing', pauseTime);

        event.target.removeEventListener("timeupdate", listenForPause, true);

        this.stopSnippet(details.id);
      }
    }

    console.log('elem', this.audioElem);

    this.audioElem.addEventListener("timeupdate", listenForPause, true);
  };


  

  playAll = () => {

    this.setState({
      currentlyPlayingAll: true
    });


    let snippetIndex = 0;
    let currentSnippetEndTime = this.props.details.snippets[snippetIndex].endTime;
    console.log('playing all',  this.props.details.snippets[snippetIndex]);

    this.audioElem.currentTime = this.props.details.snippets[snippetIndex].startTime;
    this.audioElem.play();

    const listenForSnippetEnd = (event) => {
      this.setState({
        currentlyPlayingSnippet: this.props.details.snippets[snippetIndex].id
      });
   
      if (event.target.currentTime >= currentSnippetEndTime) {
        snippetIndex += 1;
        console.log(event.target.currentTime, currentSnippetEndTime);
 
        // Remove event listener if we are at the last snippet;
        if (snippetIndex == this.props.details.snippets.length) {
          event.target.removeEventListener("timeupdate", listenForSnippetEnd, true);

          this.setState({
            currentlyPlayingSnippet: null
          });

          return this.audioElem.pause();
        }

        this.audioElem.currentTime = this.props.details.snippets[snippetIndex].startTime;
        currentSnippetEndTime = this.props.details.snippets[snippetIndex].endTime;
 
      }
    };

    this.audioElem.addEventListener("timeupdate", listenForSnippetEnd, true);
  };


  componentDidMount() {
    // So can bind timeupdate event listener to audio
    // this.audioElem = this.refs.sound;
    this.audioElem = this.refs.audio;
  }

  render(){ 
    const details = this.props.details;
    return (
      <div className="sp-song">
        { /* individual song challenge goes here */ }
        <h1>{details.title}</h1>
        <ul className="sp-snippets">

        {
          details.snippets.map((snippet, index) => <Snippet key={snippet.id} details={details.snippets[index]} playSnippet={this.playSnippet} isPlaying={this.state.currentlyPlayingSnippet == snippet.id}/>)
        }
        </ul>

        <button onClick={this.playAll}>{this.state.currentlyPlayingAll ? 'Playing' :  'Play All'}</button>

        <audio 
          ref='audio'
          className="sound-one"
          src={details.fileName}
        >
        </audio>
      </div>
    )
  }
}

export default Song;

// <Sound
//   ref='sound'
//   autoLoad={true}
//   url={details.fileName}
//   position={this.state.position/* in milliseconds */}
//   playStatus={this.state.playStatus}
// />