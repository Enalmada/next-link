# next-preload-headers

[![npm version](https://badge.fury.io/js/next-preload-headers.svg)](https://badge.fury.io/js/next-preload-headers)

express middleware that adds preload tags in body of initial response into header where
proxy will generally upgrade them to http2 server push.  Server pushing critical assets improves response time, especially for mobile users.

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
- add css to the top of the list since it is generally the most important 
- send/check a cookie with buildId so we know if resources need to be pushed for this build
- consider sorting style elements first
- figure out why sometimes getting "can't add headers to already sent response".  I think this is just an HMR issue in dev.
