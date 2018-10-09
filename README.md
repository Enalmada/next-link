# next-link

[![npm version](https://badge.fury.io/js/next-link.svg)](https://badge.fury.io/js/next-link)

Link header middleware for next/express to add static content always fetched with initial SSR request.
Everything from static is automatically served except for the current page route which needs to be defined.


TODO: 
- figure out how to automatically push everything.  
- send/check a cookie with buildId so we know if resources need to be sent 
- make default pages configurable
- look at assetPrefix rather than CDN_URL env variable

## Usage
Create environment variable called CDN_URL that matches your asset prefix
The middleware doesn't require any parameters.
Just add it to the express app like this:

```
const nextLink = require('next-link')

const app = express()

app.use(nextLink)
```

The primary use is to specify which static page this route belongs to.
(When `.pageLink` is called, the other static routes are added.)
```
app.get("/", (req, res) => {
    res.pageLink("index.js");
});
```

Other links can be pushed with `.setLink`.
`.setLink` must be called with the link IRI and the relationship:

```
app.use((req, res) => {
  res.setLink('http://example.org/context', 'http://www.w3.org/ns/json-ld#context')

  // Link: <http://example.org/context>; rel="http://www.w3.org/ns/json-ld#context"
})
```    

It's also possible to add additional attributes using a key value map:

``` 
app.use((req, res) => {
  res.setLink('http://example.org/context', 'http://www.w3.org/ns/json-ld#context', {
    title: 'example title',
    type: 'application/ld+json'
  })
  
  // Link: <http://example.org/context>; rel="http://www.w3.org/ns/json-ld#context"; title="example title"; type="application/ld+json"
})
```

If there is already a link header, the new one will be appended:

```
app.use((req, res, next) => {
  res.set('link', '<http://example.org/api>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"')
  res.setLink('http://example.org/context', 'http://www.w3.org/ns/json-ld#context')

  // Link: <http://example.org/api>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation", <http://example.org/context>; rel="http://www.w3.org/ns/json-ld#context"
})
```
