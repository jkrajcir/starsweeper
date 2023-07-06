enum TileType {
  Empty,
  Adjacent,
  Star
}

enum TileStatus {
  Unopened,
  Opened,
  Highlighted,
  Flagged,
  IncorrectlyFlagged
}

export { TileType, TileStatus }
