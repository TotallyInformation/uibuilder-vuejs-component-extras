# Some thoughts on developing in VueJS and uibuilder

## Development Environment

Note that I've not included webpack (vue-sfc-rollup includes Rollup instead) nor any snippets (I don't remember their triggers!). Nor do I include Prettier formatting, I find it a little too opinionated.

Also missing is Vue-Cli. I don't tend to use that either. Mainly because I'm not creating massive VueJS apps, only small components and simple web-apps for uibuilder. Node-RED takes care of serving up all the resources for both development and live so I don't need a dev server either.

You will most likely want `git` installed as well. The GitHub client can also be useful.

### VSCode Plugins

* ESLint
* Vetur - Includes support for .vue files, including but not limited to: Syntax-highlighting, Emmet, Linting / Error Checking, Formatting, Auto Completion, Debugging
- [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer&WT.mc_id=marketplace-pack-sdras) - This extension allows matching brackets to be identified with colours. The user can define which characters to match, and which colours to use. Super handy!
- [Bookmarks](https://marketplace.visualstudio.com/items?itemName=alefragnani.Bookmarks&WT.mc_id=marketplace-pack-sdras) - Adds a bookmark to places you designate in your file, and allows you to quickly jump between them. Super helpful. Type `command + opt + K` to create a bookmark and `command + opt + J` to jump between them 🔖
- GitLens - insight into code changes, very helpful as your code gets more complex.
- vscode-vue-peek - Enables intellisense "Go to definitionW and "Peek definition" for VueJS components.

### ESLint

In VSCode, TypeScript checking can be used with JavaScript files and it can really help avoid silly mistakes. Recommended. You may also want to add development installs of extra `@types`. `npm install -D @types/node-red` would be a good one when developing custom nodes for example.

Either way, `eslint` should also be used. Personally, I have interactive linting turned on in VSCode always.

Install eslint and plugins (install globally if you like)

```
npm install --save-dev eslint vue-eslint-parser babel-eslint eslint-plugin-vue eslint-plugin-prettier eslint-config-prettier
```

Create/update eslint config

```javascript
// enable vue in eslint

module.exports = {
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint',
    },
    plugins: ['vue'],
    extends: [
        'eslint:recommended',
        'plugin:vue/essential',
        'plugin:prettier/recommended',
    ],
}
```

### JavaScript Code Style

OK, this is very personal perhaps but, like most people, I have a strong opinion on the style I use for coding. Having a consistent style helps avoid silly mistakes and makes code reviewing much easier. 

* 4 spaces for indents
* No trailing semi's
* Trailing comma's on lists
* Use spaces around if statements and other elements. e.g. `if ( this === that ) {`
* Open braces `{` must be on the same line as in the above example

## Building Vue Components

Components should be built in a standard way such that several versions are produced.
Users of components should be able to use them in their own build steps, as Web Components,
or via direct load (`<script>` tag in HTML).

Direct load should work from both unpkg or a local install (via uibuilder's library manager).

We can use [vue-sfc-rollup](https://www.npmjs.com/package/vue-sfc-rollup) to create a suitable build environment. We need to choose whether our
module will be a library (multiple components packaged together) or a single component. (See also [Packaging Vue Components for npm — Vue.js](https://vuejs.org/v2/cookbook/packaging-sfc-for-npm.html))

```
npm install -g vue-sfc-rollup
```

```
cd project-root-folder
sfc-init
```

```
cd project-root-folder
npm run build
```

## Documenting code

Use more comments than you think you need! You will thank yourself in 12months time. If
you had to think about something or look something up before coding it, add a comment.
If you did something "clever", add a comment. If the logic isn't blindinly obvious, 
add a comment.

Use JSDoc annotations to mark up and annotate complex functions, variables and parameters, etc.

* [TypeScript JSDoc annotation limitations](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
* [JSDoc Support in Visual Studio Code](https://code.visualstudio.com/docs/languages/javascript#_jsdoc-support)
* [Use JSDoc: Index](https://jsdoc.app/)