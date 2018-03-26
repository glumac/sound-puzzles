import React from 'react';
class AudioCanvas extends React.Component {
  componentDidMount() {
    this.shouldRequestAnimationFrame = true;

    if (this.props.snippetAction) {
      this.canvas = this.audioCanvas;
      var analyser = this.props.snippetAction.analyser;
      var ctx = this.canvas.getContext('2d');
      var color = this.props.color;
      var WIDTH = this.canvas.width;
      var HEIGHT = this.canvas.height;
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);

      var renderFrame = () => {
        if (this.shouldRequestAnimationFrame)
          requestAnimationFrame(renderFrame);

        analyser.getByteFrequencyData(dataArray);

        const averageVelocity =
          dataArray.reduce((total, velocityValue) => {
            if (velocityValue > 125) {
              return total + velocityValue * velocityValue;
            } else {
              return total;
            }
          }, 0) / bufferLength;

        const fill = `rgba(255,255,255,${Math.sqrt(averageVelocity) / 150})`;

        ctx.beginPath();
        ctx.rect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.beginPath();
        ctx.rect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = fill;
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 20;

        ctx.strokeRect(0, 0, WIDTH, HEIGHT);
      };

      renderFrame();
    }
  }

  componentWillUnmount() {
    this.shouldRequestAnimationFrame = false;
  }

  render() {
    return (
      <canvas
        className="audio-canvas"
        ref={canvas => (this.audioCanvas = canvas)}
      />
    );
  }
}

export default AudioCanvas;
