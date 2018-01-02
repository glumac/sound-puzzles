// To possibly get random songs

export function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Probably helper function here for splitting up audio track into "snippets" with beginning and ending timestamps

export class Buffer {
  constructor(context, urls, songLoaded, songKey) {
    this.context = context;
    this.urls = urls;
    this.buffer = [];
    this.songLoaded = songLoaded;
    this.songKey = songKey;
  }

  loadSound(url, index) {
    let thisBuffer = this;

    console.log(this.setCurrentlyPlayingSnippet);

    fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        thisBuffer.buffer[index] = audioBuffer;


        this.songLoaded(this.songKey);

        // updateProgress(thisBuffer.urls.length);

        if (index === thisBuffer.urls.length - 1) {
          // thisBuffer.loaded();
          // console.log('loaded', thisBuffer)
        }
      }).catch(error => {
        console.log(error);
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
  constructor(context, buffer, setCurrentlyPlayingSnippet) {
    this.context = context;
    this.buffer = buffer;
    this.setCurrentlyPlayingSnippet = setCurrentlyPlayingSnippet;
  }

  setup() {
    // console.log(this.context);

    this.gainNode = this.context.createGain();
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);

    // this.gainNode.gain.setValueAtTime(0.8, this.context.currentTime);
    this.gainNode.gain.setValueAtTime(0.001, this.context.currentTime);
  }

  play(offset, length, startTime, id) {
    const timeToStart = startTime ? startTime - .005 : 0;
    const ct = this.context.currentTime + timeToStart + 0.03;
    this.setup();
    this.source.start(this.context.currentTime + timeToStart, offset);
    this.gainNode.gain.exponentialRampToValueAtTime(0.8, ct);

    this.source.stop(ct + length );

    this.setCurrentlyPlayingSnippet(id);

    console.log(offset, length, startTime);
  }

  stop(time) {
    var ct = time + 0.03 || this.context.currentTime + 0.2;
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, ct);
    this.source.stop(ct);
    // console.log(this.context);
  }

}