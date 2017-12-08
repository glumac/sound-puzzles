import React from 'react';
import Snippet from './Snippet'
import { randomFromArray } from '../helpers.js';

class Song extends React.Component {
  render(){ 
    return (
      <div className="sp-song">
        { /* individual challenge goes here */ }
        <h1>{this.props.songTitle}</h1>
        <ul className="sp-snippets">
          <Snippet />
          <Snippet />
          <Snippet />
          <Snippet />
        </ul>
      </div>
    )
  }
}

export default Song;