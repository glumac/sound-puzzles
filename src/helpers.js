// To possibly get random songs

export function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Probably helper function here for splitting up audio track into "snippets" with beginning and ending timestamps
