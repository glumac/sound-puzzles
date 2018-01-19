import {shuffleAssureNotInOriginalOrder, assignRandomColorsNoRepeats } from "./helpers";

const createSnippets = (numSnippets, snippetLength) => {
  let snippets = [],
      snippetIndex;

  for (snippetIndex = 0; snippetIndex < numSnippets; snippetIndex ++) {
    let snippet = {}

    snippet.id = snippetIndex;
    snippet.startTime = snippetIndex * snippetLength;
    snippet.endTime = (snippetIndex) + 1 * snippetLength;
    snippet.length = snippetLength;

    snippets.push(snippet);
  }

  snippets = assignRandomColorsNoRepeats(snippets);

  snippets = shuffleAssureNotInOriginalOrder(snippets);

  return snippets;
};

const songs = {
  songs: [
    {
      title: "Guilty",
      artist: "Lady Wray",
      album: "Queen Alone",
      artistUrl: "https://open.spotify.com/artist/1plioVQ0mcgAO7uhvWkJJy",
      songUrl: "https://open.spotify.com/track/5ICdHl6m8XMMZbvAR3fylo",
      fileName: ["https://glum.ac/sounds/guilty_final_chorus.m4a"],
      difficulty: "Easy",
      snippets: createSnippets(4, 2)
    },
    {
      title: "River",
      artist: "Leon Bridges",
      album: "Coming Home",
      artistUrl: "https://open.spotify.com/artist/3qnGvpP8Yth1AqSBMqON5x",
      songUrl: "https://open.spotify.com/artist/3qnGvpP8Yth1AqSBMqON5x",
      fileName: ["https://glum.ac/sounds/river_chorus.m4a"],
      difficulty: "Medium",
      snippets: createSnippets(7, 1.75)
    },
    {
      title: "Vitamin C",
      artist: "Can",
      album: "Ege Bamyasi",
      artistUrl: "https://open.spotify.com/artist/4l8xPGtl6DHR2uvunqrl8r",
      songUrl: "https://open.spotify.com/track/1tzXnPndBrd2G5GXrOBc1c",
      fileName: ["https://glum.ac/sounds/vitamin_c_chorus_shorter.m4a"],
      difficulty: "Hard",
      snippets: createSnippets(12, 1)
    }
  ]
};

export default songs;