# contactless-pay

## Build Scripts

### `yarn dev`

Builds the app for development to the `dist` folder.<br>
You will also see any lint errors in the console.

### `yarn prod`

Builds the app for production to the `dist` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.


## Release application
Build scripts `yarn dev` or `yarn prod` will auto package application to `release` folder.


## Telegram library

1. Clone Telegram library from [GramJS](https://github.com/gram-js/gramjs)
2. Use webpack to bundle Telegram library.
```
yarn
NODE_ENV=production npx webpack
node generate_webpack.js
```
3. Copy telegram.js to `src/lib/telegram`
