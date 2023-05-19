# prevent-import-loader
`prevent-import-loader` is a Webpack loader that can prevent specific modules from being imported into the code in specific environments.

## Motivation

Consider the following scenario:

```js
import renderPc from './pcRenderer'
import renderMobile from './mobileRenderer'

if (isMobileDevice) renderMobile()
else renderPc()
```

In this case, both the `pc` and `mobile` render modules will be imported into the code, which is not optimized. To prevent this, we can use `prevent-import-loader` to prevent imports in specific environments and split the code.

The optimized code will look like:

```js
// @prevent-import-in-mobile
import renderPc from './pcRenderer'
// @prevent-import-in-pc
import renderMobile from './mobileRenderer'

if (isMobileDevice) renderMobile()
else renderPc()
```

The webpack rules configuration will be as follows:

```js
{
  rules: [
    {
      test: /\.(js)$/,
      use: [
        {
          loader: 'prevent-import-loader',
          options: {
            commentKeywords: {
              '@prevent-import-in-mobile': process.env.DEVICE === 'mobile',
              '@prevent-import-in-pc': process.env.DEVICE === 'pc',
            },
          },
        },
      ],
      exclude: /node_modules/,
    },
  ]
}
```

The generated code when the environment variable `DEVICE=mobile` is set will be as follows:

```js
import renderMobile from './mobileRenderer'
const renderPc = null

if (isMobileDevice) renderMobile()
else renderPc()
```

## Installation
```sh
npm install prevent-import-loader -D
```

## Usage
```js
{
  use: [
    {
      loader: 'prevent-import-loader',
      options: {
        // comment keywords to prevent importing, default: ['@prevent-import']
        commentKeywords: ['@prevent-import'],
        // or
        commentKeywords: {
          // set to true to prevent importing, false to allow importing
          '@prevent-import': true,
        },
        // @babel/parser plugins, see https://babeljs.io/docs/babel-parser#plugins
        parserPlugins: [],
      },
    },
  ],
}
```

## Tips
- This loader only supports preventing the importing of ES modules, such as:
  - `import module from 'module'`
  - `import { variableA, functionB } from 'module'`
