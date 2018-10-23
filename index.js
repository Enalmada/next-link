/* eslint no-shadow: "off", "no-console":  off, no-unused-vars: 0, no-param-reassign: 0,
guard-for-in: 0, no-restricted-syntax: 0,  no-underscore-dangle: 0, global-require: 0, no-useless-escape: 0, no-cond-assign: 0 */

const onHeaders = require("on-headers");

function linkFile(name) {
  let as = "script";
  if (name.endsWith(".css")) {
    as = "style";
  }
  return `<${name}>; as=${as}; rel=preload; crossorigin=anonymous`;
}

// Put the preload hints in head into response headers for proxy to turn into h2 push
// Link headers are turned into h2 server push by most proxy which improves time to interactive latency.
// Use Chrome lighthouse plugin to test
function nextLink(
  app,
  req,
  res,
  pagePath,
  queryParams,
) {
  app
    .renderToHTML(req, res, pagePath, queryParams)
    .then((html) => {
      onHeaders(res, () => {
        const matches = [];
        const myRegex = /<link rel="preload" href=\"([^\"]*_next[^"]*)"/gs;
        let match;
        while (match = myRegex.exec(html)) matches.push(match[1]);
        const newLinks = matches.map(m => linkFile(m)).join("; ");

        const existingLinks = res.getHeader("link");

        if (existingLinks) {
          res.setHeader("link", `${existingLinks}, ${newLinks}`);
        } else {
          res.setHeader("link", newLinks);
        }
      });

      res.send(html);
    })
    .catch((err) => {
      app.renderError(err, req, res, pagePath, queryParams);
    });
}

module.exports = nextLink;


/* eslint no-param-reassign: 0, func-names: 0, guard-for-in: 0, no-restricted-syntax: 0,  no-underscore-dangle: 0 */
//     // <https://clientcdn.gelltest.com/_next/static/css/commons.b4f91604.chunk.css>; as=style; rel=preload
/*
const dev = process.env.NODE_ENV !== 'production'
const fs = require('fs')
const { CDN_URL } = process.env

const linkPrefix = CDN_URL ? `${CDN_URL}` : ''

function linkFile (name, as) {
  return `<${linkPrefix}${name}>; as=${as}; rel=preload; crossorigin=anonymous`
}

function getFiles (dir, mapping, as) {
  try {
    const files_ = []
    const files = fs.readdirSync(dir)
    for (const i in files) {
      const name = linkFile(`${mapping}${files[i]}`, as)
      if (!files[i].endsWith('.map') && !files[i].includes('hot-update')) {
        files_.push(name)
      }
    }
    return files_
  } catch (err) {
    return []
  }
}

const buildId = !dev
  ? fs.readFileSync('./.next/BUILD_ID', 'utf8').toString()
  : undefined

const prefix = dev ? '/_next/static/development/'
  : `/_next/static/${buildId}/`

const defaultPages = ['_app.js', '_error.js']

function pageLink (href, rel, attr) {
  const staticLinks = getFiles('./.next/static/css', '/_next/static/css/', 'style')
    .concat(getFiles('./.next/static/chunks', '/_next/static/chunks/', 'script'))
    .concat(getFiles('./.next/static/runtime', '/_next/static/runtime/', 'script'))
    .concat(defaultPages.map(p => [`<${linkPrefix}${prefix}pages/${p}>`,
      'rel=preload', 'as=script', 'crossorigin=anonymous'].join('; ')))

  //console.log(`staticLinks: ${staticLinks}`);

  attr = attr || {}

  const newLink = [`<${linkPrefix}${prefix}pages/${href}>`,
    'rel=preload', 'as=script', 'crossorigin=anonymous'].concat(Object.keys(attr).map(key => `${key}="${attr[key]}"`)).join('; ')

  staticLinks.push(newLink)

  const existingLinks = this.get('link')

  if (existingLinks) {
    this.set('link', `${existingLinks}, ${staticLinks.toString()}`)
  } else {
    this.set('link', staticLinks.toString())
  }
}

function setLink (href, rel, attr) {
  attr = attr || {}

  const newLink = [`<${href}>`, `rel="${rel}"`].concat(Object.keys(attr).map(key => `${key}="${attr[key]}"`)).join('; ')

  const existingLinks = this.get('link')

  if (existingLinks) {
    this.set('link', `${existingLinks}, ${newLink}`)
  } else {
    this.set('link', newLink)
  }
}

function middleware (req, res, next) {
  res.pageLink = pageLink
  res.setLink = setLink
  next()
}

middleware.attach = function (res) {
  res.pageLink = pageLink
  res.setLink = setLink
}

module.exports = middleware
*/
