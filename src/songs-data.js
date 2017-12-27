// module.exports = {
//   songs: [
//     {
//       id: "song-one",
//       title: 'Song one',
//       fileName: 'http://glum.ac/sounds/better-off.m4a',
//       snippets: [
//         {
//           id: 0,
//           startTime: 3,
//           endTime: 6,
//           length: 3
//         },
//         {
//           id: 1,
//           startTime: 9,
//           endTime: 12,
//           length: 3
//         },
//         {
//           id: 2,
//           startTime: 0,
//           endTime: 3,
//           length: 3
//         },
//         {
//           id: 3,
//           startTime: 6,
//           endTime: 9,
//           length: 3
//         }
//       ]
//     }
//   ]
// }


// In order
module.exports = {
  songs: [
    {
      id: "song-one",
      title: 'Song one',
      fileName: ['https://glum.ac/sounds/better-off.m4a'],
      // fileName: './songs/better-off.wav',
      snippets: [
        {
          id: 0,
          startTime: 0,
          endTime: 3,
          length: 3
        },
        {
          id: 1,
          startTime: 3,
          endTime: 6,
          length: 3
        },
        {
          id: 2,
          startTime: 6,
          endTime: 9,
          length: 3
        },
        {
          id: 3,
          startTime: 9,
          endTime: 12,
          length: 3
        }
      ]
    }
  ]
}