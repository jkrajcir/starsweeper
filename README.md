# Starsweeper

## Table of Contents

1. [What is Starsweeper?](#what-is-starsweeper)
2. [Why was Starsweeper Made?](#why-was-starsweeper-made)
3. [Project Structure and Tech Used to Build Starsweeper](#project-structure-and-tech-used-to-build-starsweeper)
4. [How to Install and Run Client Project](#how-to-install-and-run-client-project-serverless-project-not-required-leaderboards-wont-load)

---

### What is Starsweeper?

Starsweeper is a recreation of the game [Minesweeper](<https://en.wikipedia.org/wiki/Minesweeper_(video_game)>).

Starsweeper features include:

- 3 game difficulties:
  - Easy difficulty has a 9x9 board with 10 stars
  - Normal difficuly has a 16x16 board with 40 stars
  - Hard difficulty has a 30x16 board with 99 stars
- Personal best time tracking
  - This is tied to your browser
- Leaderboard for top 10 times over various date ranges
  - Grouped by difficulty
  - Date ranges are: Today, Last 7 Days, Last 30 Days, Last Year, and All Time

### Why was Starsweeper Made?

I had a knack to implement minesweeper, and I also wanted to learn how to use VueJs, so I put some time into these two desires and created Starsweeper.

### Project Structure and Tech Used to Build Starsweeper

This project is organized as a monorepo.

All Projects:

- Implemented using TypeScript
- Prettier for formatting and ESLint for static analysis

[`common` Project](./common/):

- Project referenced by both `client` and `serverless` projects

[`client` Project](./client/):

- Vite front-end tooling
- VueJs SFCs with TypeScript and SCSS
- Pinia for state management
- Icons from [Remix Icon](https://remixicon.com/)
- Favicon from [favicon.io](https://favicon.io/)

[`serverless` Project](./serverless/):

- DigitalOcean Functions for serverless back-end
- Rollup for bundling a serverless function
- Two functions:
  - [`get-leaderboard-entries`](./serverless/packages/starsweeper/get-leaderboard-entries/)
    - Gets leaderboard entries from Managed PostgreSQL cluster
  - [`save-new-top-time`](./serverless/packages/starsweeper/save-new-top-time/)
    - Saves a new top time if player has placed onto the leaderboard

Database:

- DigitalOcean Managed Database to host PostgreSQL 15 cluster
- [DDL](./db/ddl/) and [DML](./db/dml/)

Infrastructure:

- GitHub Actions for CI workflows
  - CI workflow for both `client` and `serverless` projects, which run when a PR is opened
- DigitalOcean App Platform to host and manage `client`, `serverless` functions, and Database under one app
- Deployed using DigitalOcean App Platform's automatic deployment

### How to Install and Run `client` Project (`serverless` project not required, leaderboards won't load)

#### Monorepo Prettier and ESLint Setup

```sh
npm install
```

#### `common` Project Setup

```sh
cd common
npm install
npm run build
```

#### `client` Project Setup

```sh
cd client
npm install
```

#### Compile and Hot-Reload for Development

```sh
cd client
npm run dev
```

#### Type-Check, Compile and Minify for Production

```sh
cd client
npm run build
```

#### Lint with [ESLint](https://eslint.org/)

```sh
cd client
npm run lint
```
