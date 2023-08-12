enum TileType {
  Empty,
  Adjacent,
  Star
}

enum TileStatus {
  Unopened,
  Opened,
  Flagged,
  IncorrectlyFlagged
}

export { TileType, TileStatus }
