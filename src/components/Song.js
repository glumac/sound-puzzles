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
      playFromPosition: 0, 
      playStatus: Sound.status.STOPPED
    };
  }

  stopSnippet = (snippetId) => {
    console.log('stopping');

    this.setState({
      playStatus: Sound.status.STOPPED,
      currentlyPlayingSnippet: null,
    }, function () {
      console.log(this.state);
    });
  }

  playSnippet = (snippetId) => {
    if (this.state.currentlyPlayingSnippet == snippetId) {
      return this.stopSnippet(snippetId);
    }

    this.setState({
      currentlyPlayingSnippet: snippetId,
      playFromPosition: this.props.details.snippets[snippetId].startTime,
      playStatus: Sound.status.PLAYING

    }, function(){
      console.log(this.state.playFromPosition);
    });
  };

  playAll = () => {
    console.log('playing all', this.props);
  };

  render(){ 
    const details = this.props.details;
    return (
      <div className="sp-song">
        { /* individual song challenge goes here */ }
        <h1>{details.title}</h1>
        <ul className="sp-snippets">

        {
            details.snippets.map((snippet, index) => {<Snippet key={snippet.id} details={details.snippets[index]} playSnippet={this.playSnippet} isPlaying={this.state.currentlyPlayingSnippet == snippet.id}/>})
        }
        </ul>

        <button onClick={this.playAll}>Play All</button>

        <Sound
          autoLoad = true
          url={details.fileName}
          playFromPosition={this.state.playFromPosition /* in milliseconds */}
          playStatus={this.state.playStatus}
        />
      </div>
    )
  }
}

export default Song;