import {getRandomColor, shuffleAssureNotInOriginalOrder, assignRandomColorsNoRepeats } from "./helpers";
import shuffle from "lodash/shuffle";

// const randomOrderColors = shuffle(colors); 

const songs = {
  songs: [
    {
      id: "song-one",
      loaded: false,
      inCorrectOrder: false,
      title: "Guilty",
      difficulty: 'Easy',
      artist: "Lady Wray",
      artistUrl: "https://open.spotify.com/artist/1plioVQ0mcgAO7uhvWkJJy",
      songUrl: "https://open.spotify.com/track/5ICdHl6m8XMMZbvAR3fylo",
      fileName: ["https://glum.ac/sounds/guilty_final_chorus.m4a"],
      snippets: assignRandomColorsNoRepeats([
        {
          id: 0,
          startTime: 0,
          endTime: 1,
          length: 1
        },
        {
          id: 1,
          startTime: 1,
          endTime: 2,
          length: 1
        },
        {
          id: 2,
          startTime: 2,
          endTime: 3,
          length: 1
        },
        {
          id: 3,
          startTime: 3,
          endTime: 4,
          length: 1
        }
      ])
    }
  ]
};



// In order
// module.exports = {
//   songs: [
//     {
//       id: "song-one",
//       loaded: false,
//       title: 'Guilty',
//       artist: 'Lady Wray',
//       artistUrl: 'https://open.spotify.com/artist/1plioVQ0mcgAO7uhvWkJJy',
//       songUrl: 'https://open.spotify.com/track/5ICdHl6m8XMMZbvAR3fylo',
//       fileName: ['https://glum.ac/sounds/guilty_final_chorus.m4a'],
//       snippets: [
//         {
//           id: 0,
//           startTime: 0,
//           endTime: 3.1,
//           length: 3.1
//         },
//         {
//           id: 1,
//           startTime: 3,
//           endTime: 5.99999,
//           length: 2.99999
//         },
//         {
//           id: 2,
//           startTime: 6,
//           endTime: 8.99999,
//           length: 2.99999
//         },
//         {
//           id: 3,
//           startTime: 9,
//           endTime: 11.99999,
//           length: 2.99999
//         },
//         {
//           id: 4,
//           startTime: 12,
//           endTime: 14.99999,
//           length: 2.99999
//         },
//         {
//           id: 5,
//           startTime: 15,
//           endTime: 17.99999,
//           length: 2.99999
//         },
//         {
//           id: 6,
//           startTime: 18,
//           endTime: 20.99999,
//           length: 2.99999
//         },
//         {
//           id: 7,
//           startTime: 21,
//           endTime: 23.99999,
//           length: 2.99999
//         },
//         {
//           id: 8,
//           startTime: 24,
//           endTime: 25.99999,
//           length: 2.99999
//         },
//         {
//           id: 9,
//           startTime: 27,
//           endTime: 29.99999,
//           length: 2.99999
//         },
//         {
//           id: 10,
//           startTime: 30,
//           endTime: 32.99999,
//           length: 2.99999
//         } 
//       ]
//     }
//   ]
// }

export default songs;