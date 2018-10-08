/* global describe, it */

const assert = require('assert')
const express = require('express')
const request = require('supertest')
const setLink = require('..')

describe('response-set-link', () => {
  it('should be a middleware', () => {
    assert.strictEqual(typeof setLink, 'function')
    assert.strictEqual(setLink.length, 3)
  })

  it('should assign .setLink method to the response', () => {
    const app = express()

    app.use(setLink)

    app.use((req, res) => {
      assert.strictEqual(typeof res.setLink, 'function')
      assert.strictEqual(res.setLink.length, 3)

      res.end()
    })

    return request(app).get('/').then(() => {})
  })

  it('should set a link header with href and rel', () => {
    const app = express()

    app.use(setLink)

    app.use((req, res) => {
      res.setLink('http://example.org/context', 'http://www.w3.org/ns/json-ld#context')

      res.end()
    })

    return request(app).get('/').then((res) => {
      assert.strictEqual(res.get('link'), '<http://example.org/context>; rel="http://www.w3.org/ns/json-ld#context"')
    })
  })

  it('should set a link header with attributes', () => {
    const app = express()

    app.use(setLink)

    app.use((req, res) => {
      res.setLink('http://example.org/context', 'http://www.w3.org/ns/json-ld#context', {
        title: 'example title',
        type: 'application/ld+json'
      })

      res.end()
    })

    return request(app).get('/').then((res) => {
      assert.strictEqual(res.get('link'), '<http://example.org/context>; rel="http://www.w3.org/ns/json-ld#context"; title="example title"; type="application/ld+json"')
    })
  })

  it('should merge existing link headers', () => {
    const app = express()

    app.use((req, res, next) => {
      res.set('link', '<http://example.org/api>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"')

      next()
    })

    app.use(setLink)

    app.use((req, res) => {
      res.setLink('http://example.org/context', 'http://www.w3.org/ns/json-ld#context')

      res.end()
    })

    return request(app).get('/').then((res) => {
      assert.strictEqual(res.get('link'), [
        '<http://example.org/api>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"',
        '<http://example.org/context>; rel="http://www.w3.org/ns/json-ld#context"'
      ].join(', '))
    })
  })

  it('should attach the .setLink method', () => {
    const app = express()

    app.use((req, res) => {
      setLink.attach(res)

      res.setLink('http://example.org/context', 'http://www.w3.org/ns/json-ld#context')

      res.end()
    })

    return request(app).get('/').then((res) => {
      assert.strictEqual(res.get('link'), '<http://example.org/context>; rel="http://www.w3.org/ns/json-ld#context"')
    })
  })
})
