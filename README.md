# next-preload-headers

[![npm version](https://badge.fury.io/js/next-preload-headers.svg)](https://badge.fury.io/js/next-preload-headers)

express middleware that copies next static link preload tags in head of initial response into response header where
proxy will server converts them to http2 server push.  Server pushing all assets required for interactivity
significantly decreases the initial latency, especially for mobile users.

## Usage

```
npm install --save next-preload-headers
```

Add it to the express server.js like this:

```
const nextPreloadHeaders = require('next-preload-headers')

const app = express()

app.use(nextPreloadHeaders)
```


TODO: 
- send/check a cookie with buildId so we know if resources need to be pushed for this build
- consider sorting style elements first
