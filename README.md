# recma-mdx-frontmatter

Recma plugin to add frontmatter data as a property to MDX components.

Compatible with [MDX](https://mdxjs.com/) and [Next.js](https://nextjs.org/). You can use this plugin to render templates based on MDX frontmatter.

## Usage

Install the plugin:

```bash
npm install recma-mdx-frontmatter
```

Enable it in your `next.config.js`:

```js
const withMDX = require("@next/mdx")({
  options: {
    // add it here!
    recmaPlugins: [require("recma-mdx-frontmatter")]
  }
})

const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
}

module.exports = withMDX(nextConfig)
```

Create some MDX pages with frontmatter:

```mdx
---
title: My page title
author: Adam Jones
---

This is an awesome MDX page
```

Use the `.frontmatter` property, for example in `_app.tsx`:

```tsx
import "../styles/globals.css"
import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="mdx-content">
      <header>
        <h1>{Component.frontmatter.title}</h1>
        <p>Written by {Component.frontmatter.author}</p>
      </header>
      <Component {...pageProps} />
    </div>
  )
}
```

Only some of your pages use MDX and want to use different layouts for non-MDX pages? Try [recma-mdx-displayname](https://github.com/domdomegg/recma-mdx-displayname).

## Contributing

Pull requests are welcomed on GitHub! To get started:

1. Install Git and Node.js
2. Clone the repository
3. Install dependencies with `npm install`
4. Run `npm run test` to run tests
5. Build with `npm run build`

## Releases

Versions follow the [semantic versioning spec](https://semver.org/).

To release:

1. Use `npm version <major | minor | patch>` to bump the version
2. Run `git push --follow-tags` to push with tags
3. Wait for GitHub Actions to publish to the NPM registry.