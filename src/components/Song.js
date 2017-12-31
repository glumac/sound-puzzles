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

    this.snippetAction = new SnippetAction(this.props.context, this.buffer.getSound(0));
    this.snippetAction.play(details.startTime, details.length);
    
    playing = true;

    this.setState({
      currentlyPlayingSnippet: details.id,
      position: details.startTime
    })
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

  playAll = () => {
    console.log(playTimeout);
    let nextNotetime = this.props.context.currentTime;

    if (this.state.currentlyPlayingAll === true) {
      this.setState({
        currentlyPlayingSnippet: null,
        currentlyPlayingAll: false
      });

      // return this.audioElem.pause();

      // clearTimeout(playTimeout);
    }

    this.setState({
      currentlyPlayingAll: true
    });

    // this.props.details.snippets.map((snippet, index) => {
    //   var snippetAction = new SnippetAction(this.props.context, this.buffer.getSound(0));
      
    //   snippetAction.play(snippet.startTime, snippet.length, index * 3);
    // })

    var nextSnippet = 0;
    var snippetsLength = this.props.details.snippets.length;
    var allSnippets = [];
    

    var clearPlayAll = () => {
      this.setState({
        currentlyPlayingSnippet: null,
        currentlyPlayingAll: false
      });
    }


    var scheduler = () => {
      var snippet = this.props.details.snippets[nextSnippet];

      console.log('scheduler', nextSnippet. snippet);

      if (nextSnippet >= snippetsLength) {
        return clearPlayAll();
      }
      



      while (nextNotetime < this.props.context.currentTime) {

        this.setState({
          currentlyPlayingSnippet: nextSnippet
        })

        nextNotetime += snippet.length;
        // console.log(nextNotetime);

        // var nextSnippet = typeof this.state.currentlyPlayingSnippet === 'number' ? this.state.currentlyPlayingSnippet + 1 : 0;

        allSnippets[nextSnippet] = new SnippetAction(this.props.context, this.buffer.getSound(0));
        allSnippets[nextSnippet].play(snippet.startTime, snippet.length);

        if (nextSnippet > 0) allSnippets[nextSnippet - 1].stop();

        nextSnippet += 1;

        //   //   // console.log(nextNotetime, this.props.context.currentTime + 0.1);

        //   nextNotetime += 0.5;
        //   console.log(nextNotetime);
        // })
      } 

      console.log(nextNotetime, this.props.context.currentTime + 0.1, snippet.length, snippet.id,  snippetsLength);

      window.setTimeout(scheduler, 50.0);    
    };
    
   
    scheduler();    
  



  
    // this.audioElem.currentTime = this.props.details.snippets[snippetIndex].startTime;

    // this.audioElem.play();

    // console.log('playing all', this.props.details.snippets[snippetIndex]);

    // const prepNextSnippet = () => {
    //   console.log(snippetIndex);

    //   if (snippetIndex == this.props.details.snippets.length - 1) {
    //     playTimeout = setTimeout(() => {
    //       console.log('last');

    //       this.audioElem.pause();

    //       this.setState({
    //         currentlyPlayingSnippet: null,
    //         currentlyPlayingAll: false
    //       });
    //     }, this.props.details.snippets[snippetIndex].length * 1000);
    //   } else {
    //     snippetIndex += 1;

    //     playTimeout = setTimeout(() => {
    //       this.audioElem.currentTime = this.props.details.snippets[snippetIndex].startTime;


    //       this.setState({
    //         currentlyPlayingSnippet: snippetIndex
    //       });

    //       prepNextSnippet();
    //     }, this.props.details.snippets[snippetIndex].length * 1000);
    //   }
    // }

    // this.setState({
    //   currentlyPlayingSnippet: snippetIndex
    // })

    // prepNextSnippet();

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

        <div className={`sp-song-loading-overlay ${details.loaded ? 'loaded' : 'loading'}`}>
          <h2>Loading song...</h2>
        </div>

        

      </div>
    )
  }
}

export default Song;