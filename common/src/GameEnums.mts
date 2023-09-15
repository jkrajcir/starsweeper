enum GameDifficulty {
  Easy,
  Normal,
  Hard
}

enum DateRange {
  Today,
  Last7Days,
  Last30Days,
  Last1Year,
  AllTime
}

const DateRangeNames: Map<DateRange, string> = new Map([
  [DateRange.Today, 'Today'],
  [DateRange.Last7Days, 'Last 7 Days'],
  [DateRange.Last30Days, 'Last 30 Days'],
  [DateRange.Last1Year, 'Last Year'],
  [DateRange.AllTime, 'All Time']
])

export { GameDifficulty, DateRange, DateRangeNames }
