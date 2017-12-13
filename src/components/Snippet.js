import React from 'react';

class Snippet extends React.Component {
  render () {
    const { details, isPlaying } = this.props;

    return (
      <li className={`sp-snippet ${isPlaying ? 'playing' : 'not-playing'}`} onClick={() => this.props.playSnippet(details.id) }>
        {details.id}
      </li>
    )
  }
}

export default Snippet;