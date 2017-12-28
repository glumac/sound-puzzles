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

  componentDidMount() {
    this.snippetAction = null;

    this.buffer = new Buffer(this.props.context, this.props.details.fileName);
    this.snippetActionSound = this.buffer.getBuffer();
  }

  playSnippet = (details) => {
    if (this.state.currentlyPlayingSnippet === details.id) {
      return this.stopSnippet(details.id);
    } 

    // console.log('currentplay', this.state.currentlyPlayingSnippet);

    if (typeof this.state.currentlyPlayingSnippet === 'number') {
      console.log('currentplay', this.state.currentlyPlayingSnippet);
      
      this.stopSnippet(this.state.currentlyPlayingSnippet);
    } 

    // this.audioElem.currentTime = details.startTime;

    // console.log('CONTEXTTTTTTTTT', this.props.context);

    this.snippetAction = new SnippetAction(this.props.context, this.buffer.getSound(0));
    this.snippetAction.play(details.startTime);

    this.setState({
      currentlyPlayingSnippet: details.id,
      position: details.startTime

    }, function(){
      // console.log(this.state.position);
    });
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