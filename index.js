/* eslint no-cond-assign: 0 */

const interceptor = require("express-interceptor");


function linkFile(name) {
  // All the nextjs stuff is simple.  This would need to get more complex if we wanted to do more than
  // next static (endings may not be just js or css)
  let as = "script";
  if (name.endsWith(".css")) {
    as = "style";
  }
  return `<${name}>; as=${as}; rel=preload; crossorigin=anonymous`;
}

module.exports = interceptor((req, res) => ({
  // Only HTML responses will be intercepted
  isInterceptable() {
    return /text\/html/.test(res.get("Content-Type"));
  },
  // Appends a paragraph at the end of the response body
  intercept(body, send) {
    const matches = [];
    const myRegex = /<link rel="preload" href="([^"]*_next[^"]*)"/gs;
    let match;
    while (match = myRegex.exec(body)) matches.push(match[1]);
    const newLinks = matches.map(m => linkFile(m)).join("; ");

    // Add to existing links if exist
    const existingLinks = res.getHeader("link");

    if (existingLinks) {
      res.setHeader("link", `${existingLinks}, ${newLinks}`);
    } else {
      res.setHeader("link", newLinks);
    }

    send(body);
  },
}));
