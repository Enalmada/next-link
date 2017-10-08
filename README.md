# set-link

[![Build Status](https://travis-ci.org/bergos/set-link.svg?branch=master)](https://travis-ci.org/bergos/set-link)
[![npm version](https://badge.fury.io/js/set-link.svg)](https://badge.fury.io/js/set-link)

Link header middleware for express with multiple value and attribute support.

## Usage

The middleware doesn't require any parameters.
Just add it to the express app like this:

```
const setLink = require('set-link')

const app = express()

app.use(setLink)
```

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
