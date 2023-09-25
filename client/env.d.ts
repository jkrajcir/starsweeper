/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SAVE_NEW_TOP_TIME_URL: string
  readonly VITE_GET_LEADERBOARD_ENTRIES_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
