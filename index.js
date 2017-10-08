function setLink (href, rel, attr) {
  attr = attr || {}

  const newLink = ['<' + href + '>', 'rel="' + rel + '"'].concat(Object.keys(attr).map((key) => {
    return key + '="' + attr[key] + '"'
  })).join('; ')

  const existingLinks = this.get('link')

  if (existingLinks) {
    this.set('link', existingLinks + ', ' + newLink)
  } else {
    this.set('link', newLink)
  }
}

function middleware (req, res, next) {
  res.setLink = setLink

  next()
}

middleware.attach = function (res) {
  res.setLink = setLink
}

module.exports = middleware
