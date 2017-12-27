import React from 'react';
import Snippet from './Snippet'
// import logo  from './logo.svg';
// import ReactAudioPlayer from 'react-audio-player';
// import Sound from 'react-sound';
import { Buffer } from '../helpers.js';
import { SnippetAction} from '../helpers.js';

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
    
    // this.source.stop();
    // this.source.disconnect();

    this.snippetAction.stop();
  

    this.setState({
      currentlyPlayingSnippet: null,
    }, function () {
      console.log(this.state);
    }); 
  }

  componentDidMount() {
    this.snippetAction = null;
    this.context = new (window.AudioContext || window.webkitAudioContext)();

    this.buffer = new Buffer(this.context, this.props.details.fileName);
    this.snippetActionSound = this.buffer.getBuffer();

    // this.context = new (window.AudioContext || window.webkitAudioContext)();
    // this.songBuffer = null;
    // this.source = null;

    // window.fetch(this.props.details.fileName)
    //   .then(response => response.arrayBuffer())
    //   .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer))
    //   .then(audioBuffer => {
    //     this.songBuffer = audioBuffer;

    //     // play(this.songBuffer)
    //   });

    // const play = (audioBuffer) => {
    //   // this.source = this.context.createBufferSource();
    //   // this.source.buffer = this.songBuffer;
    // }
  }

  playSnippet = (details) => {
    if (this.state.currentlyPlayingSnippet === details.id) {
      return this.stopSnippet(details.id);
    } 

    // this.audioElem.currentTime = details.startTime;
    // this.audioElem.play()

    console.log(this.context);

    this.snippetAction = new SnippetAction(this.context, this.buffer.getSound(0));
    this.snippetAction.play();

    // console.log(this.context);

    // this.source = this.context.createBufferSource();
    // this.source.buffer = this.songBuffer;
    // this.source.connect(this.context.destination);
    // this.source.start(0, details.startTime);
    // // console.log(details, 'audiooo',  this.audioElem.currentTime);
    this.setState({
      currentlyPlayingSnippet: details.id,
      position: details.startTime

    }, function(){
      // console.log(this.state.position);
    });

    // const listenForPause = (event) => {
    //   const pauseTime = details.endTime;

    //   console.log(event.target.currentTime, pauseTime);

    //   if (event.target.currentTime >= pauseTime) {
    //     console.log('pausing', pauseTime);

    //     event.target.removeEventListener("timeupdate", listenForPause, true);

    //     this.stopSnippet(details.id);
    //   }
    // }

    // console.log('elem', this.audioElem);

    // this.audioElem.addEventListener("timeupdate", listenForPause, true);
  };

  playAll = () => {
    console.log(playTimeout);
    

    if (this.state.currentlyPlayingAll === true ) {
      this.setState({
        currentlyPlayingSnippet: null, 
        currentlyPlayingAll: false
      });

      return this.audioElem.pause();

      clearTimeout(playTimeout);
    }

    this.setState({
      currentlyPlayingAll: true
    });

    let snippetIndex = 0;
  

    this.audioElem.currentTime = this.props.details.snippets[snippetIndex].startTime;

    this.audioElem.play();

    console.log('playing all',  this.props.details.snippets[snippetIndex]);

    const prepNextSnippet = () => {
      console.log(snippetIndex);

      if (snippetIndex == this.props.details.snippets.length - 1) {
        playTimeout = setTimeout(() => {
          console.log('last');

          this.audioElem.pause();

          this.setState({
            currentlyPlayingSnippet: null,
            currentlyPlayingAll: false
          });
        }, this.props.details.snippets[snippetIndex].length * 1000);
      } else {
        snippetIndex += 1;

        playTimeout = setTimeout(() => {
          this.audioElem.currentTime = this.props.details.snippets[snippetIndex].startTime;


          this.setState({
            currentlyPlayingSnippet: snippetIndex
          });

          prepNextSnippet();
        }, this.props.details.snippets[snippetIndex].length * 1000);
      }
    }

    this.setState({
      currentlyPlayingSnippet: snippetIndex
    })

    prepNextSnippet();

    // setTimeOut(goToNextSnippet, currentSnippetLength * 1000);

    // const listenForSnippetEnd = (event) => {
    //   this.setState({
    //     currentlyPlayingSnippet: this.props.details.snippets[snippetIndex].id
    //   });
   
    //   if (event.target.currentTime >= currentSnippetEndTime) {
    //     snippetIndex += 1;
    //     console.log(event.target.currentTime, currentSnippetEndTime);
 
    //     // Remove event listener if we are at the last snippet;
    //     if (snippetIndex == this.props.details.snippets.length) {
    //       event.target.removeEventListener("timeupdate", listenForSnippetEnd, true);

    //       this.setState({
    //         currentlyPlayingSnippet: null
    //       });

    //       return this.audioElem.pause();
    //     }

    //     this.audioElem.currentTime = this.props.details.snippets[snippetIndex].startTime;
    //     currentSnippetEndTime = this.props.details.snippets[snippetIndex].endTime;
 
    //   }
    // };

    // this.audioElem.addEventListener("timeupdate", listenForSnippetEnd, true);
  };

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