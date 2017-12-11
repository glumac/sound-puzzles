import React from 'react';

class Snippet extends React.Component {
  render () {
    const snippet = this.props.details;
    return (
      <li className="sp-snippet">
        {snippet.id}
      </li>
    )
  }
}

export default Snippet;