# ASCII Portfolio

Welcome to my portfolio that is 100% ASCII! Check it out here [http://wolffruoff.github.io/ASCII-Portfolio/](http://wolffruoff.github.io/ASCII-Portfolio/).

There's also a hidden minigolf game: drag the ball beside the bio to putt.

## Development

Needs Node 20.19 or newer.

```sh
npm install
npm start      # dev server at http://localhost:5173/ASCII-Portfolio/
npm test       # unit tests
npm run lint   # eslint
npm run deploy # build and publish to the gh-pages branch
```

New minigolf levels go in `src/golf/levels`; see the `Level` type in `types.ts` for the format.
