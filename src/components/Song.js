import React from 'react';
import Snippet from './Snippet'
import { randomFromArray } from '../helpers.js';

class Song extends React.Component {
  render(){ 
    const details = this.props.details;
    return (
      <div className="sp-song">
        { /* individual challenge goes here */ }
        <h1>{details.title}</h1>
        <ul className="sp-snippets">

        {
          details.snippets.map((snippet, index) => <Snippet key={snippet.id} details={details.snippets[index]} />)
        }
        </ul>
      </div>
    )
  }
}

export default Song;