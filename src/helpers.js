import shuffle from "lodash/shuffle";

// To possibly get random songs
export function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const colors = ["#023fa5", "#7d87b9", "#bec1d4", "#d6bcc0", "#bb7784", "#8e063b", "#4a6fe3", "#8595e1", "#b5bbe3", "#e6afb9", "#e07b91", "#d33f6a", "#11c638", "#8dd593", "#c6dec7", "#ead3c6", "#f0b98d", "#ef9708", "#0fcfc0", "#9cded6", "#d5eae7", "#f3e1eb", "#f6c4e1", "#f79cd4"];

export function getRandomColor() {
  return randomFromArray(colors);
}

export function assignRandomColorsNoRepeats (array) {
  let colorArray = colors.slice();
  let random;

  return array.map((item) => {
    random = Math.floor(Math.random() * colorArray.length);
    item.color = colorArray[random];
    colorArray.splice(random, 1);

    if (!colorArray.length) colorArray = colors.slice();

    return item;
  });
} 

export function checkIfInOrder(arr) {
  let inOrder = true;

  for (let i = 0; i < arr.length - 1; i++) {
    if (i != arr[i].id) {
      inOrder = false;
      break;
    }
  }

  return inOrder;
}

export function shuffleAssureNotInOriginalOrder (array) {
  let shuffledArray = shuffle(array);

  while(checkIfInOrder(shuffledArray)){
    console.log('was in order');
    
    shuffledArray = shuffle(array);
  }

  return shuffledArray;
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
    this.gainNode = this.context.createGain();
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    this.gainNode.gain.setValueAtTime(0.001, this.context.currentTime);
  }

  play(offset, length, startTime, id, stopSnippet) {
    const timeToStart = startTime > 0 ? startTime - .005 : 0;

    // console.log(timeToStart);
    
    const ct = this.context.currentTime + timeToStart + 0.03;
    this.setup();
    this.source.start(this.context.currentTime + timeToStart, offset);
    this.gainNode.gain.exponentialRampToValueAtTime(0.8, ct);
  
    // if (length && stopSnippet) this.source.stop(ct + length);

    // console.log(length, stopSnippet);

    this.setCurrentlyPlayingSnippet(id);

    // console.log(this.context.currentTime, this.context.currentTime + length);

    if (!length) return;

    this.gainNode.gain.setTargetAtTime(.00001, this.context.currentTime + length, 0.03);
    this.source.stop(this.context.currentTime + length + 0.2);

    // console.log(offset, length, startTime);
  }

  stop(time, decay) {
    console.log(time, decay, 'stopping');

    this.cancelScheduledValues();

    var ct = decay ? time + decay : this.context.currentTime + 1.9;

    // console.log(ct);
    
    // this.gainNode.gain.exponentialRampToValueAtTime(0.001, ct);
    // this.source.stop(ct);
    // console.log(this.context);

    this.gainNode.gain.setTargetAtTime(0.001, this.context.currentTime, 0.03);
    // still need to actually stop it or will hear oh so faintly playing 
    this.source.stop(this.context.currentTime + 0.5);
  }


  cancelScheduledValues() {
    this.gainNode.gain.cancelScheduledValues(this.context.currentTime);
  }

}