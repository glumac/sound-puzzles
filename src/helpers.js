// To possibly get random songs

export function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Probably helper function here for splitting up audio track into "snippets" with beginning and ending timestamps


export class Buffer {
  constructor(context, urls) {
    this.context = context;
    this.urls = urls;
    this.buffer = [];
  }

  loadSound(url, index) {
    let thisBuffer = this;

    fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        thisBuffer.buffer[index] = audioBuffer;

        // updateProgress(thisBuffer.urls.length);

        if (index == thisBuffer.urls.length - 1) {
          // thisBuffer.loaded();


          console.log(thisBuffer)
        }
      })
  }

  getBuffer() {
    this.urls.forEach((url, index) => {
      this.loadSound(url, index);
    })
  }

  getSound(index) {
    return this.buffer[index];
  }
}


export class SnippetAction{
  constructor(context, buffer) {
    this.context = context;
    this.buffer = buffer;
  }

  setup() {
    console.log(this.context);


    this.gainNode = this.context.createGain();
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);

    this.gainNode.gain.setValueAtTime(0.8, this.context.currentTime);
  }

  play() {
    this.setup();
    this.source.start(this.context.currentTime);
  }

  stop() {
    console.log(ct);
    var ct = this.context.currentTime + 0.5;
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, ct);
    this.source.stop(ct);
    console.log(this.context);
  }

}