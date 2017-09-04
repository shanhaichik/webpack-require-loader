# webpack-require-loader
Loader receives a file tree from a template and import them with the necessary parameters settings.

It can be used to import any kind of files. You can use it in javascript files or style files. Works great with ng-include and ng-cache when developing angular applications.

[Use with angular](https://github.com/shanhaichik/webpack-require-loader/blob/master/ANGULAR.md)

[Help author (donate)](https://www.paypal.me/shanhaichik)
## Support Webpack 1.x and Webpack 2.x

## Install

`npm i required-loader --save-dev`

## Simple Usage
Add in your code comment:
```js
/* input string in code */
//@require "./modules/**/index.js"

/* output */
require('./modules/one/index.js');
require('./modules/two/index.js');
require('./modules/three/index.js');

```

## Usage with import props
Add in your code comment:
```js
//@require "./modules/**/index.js?import[]=angular,go={hello:'world'}"
```
* If the import parameters are set in the webpack.config.js file and in @require comment,
they both will be imported into the included files

## More examples
```js
//@require "./modules/**/index.js?import[]=angular,import[]=$=jquery,go={hello:'world'}"

//@require "./**/!(index|config|run)*"

//@require "./**/*"

//@require "./**/*.html"
```

## Usage in CSS/SCSS/STYL/LESS files
```css
/* input string in style file */
@require "./**/!(app|bootstrap).css";
@require "./**/*.less";
@require "./**/*.scss";
@require "./**/*.styl";
/* output */
@import 'style/header.css';
@import 'style/layout.css';
@import 'style/menus.css';
```

### webpack.config.js
## JS loader
```js
{
test: /\.js$/,
  loader: 'required?import[]=angular',
}

OR

loaders: ["ng-annotate","babel","required?import[]=angular,params={ip:'0.0.0.0'}"]
```

## CSS loaders
```js
{
test: /\.css$/,
  loader: 'required',
}

OR

loader: ExtractTextPlugin.extract("style","css?sourceMap!postcss!required")
```

### Params

Param | Description
------------|-------
`import` | `import modules in required scripts`
`params` | `import params in required scripts. It can be any variable name. Params in loader === var params = {ip:'0.0.0.0'} in file witch require`

The following characters have special magic meaning when used in a
path portion:

* `*` Matches 0 or more characters in a single path portion
* `?` Matches 1 character
* `[...]` Matches a range of characters, similar to a RegExp range.
If the first character of the range is `!` or `^` then it matches
any character not in the range.
* `!(pattern|pattern|pattern)` Matches anything that does not match
any of the patterns provided.
* `?(pattern|pattern|pattern)` Matches zero or one occurrence of the
patterns provided.
* `+(pattern|pattern|pattern)` Matches one or more occurrences of the
patterns provided.
* `*(a|b|c)` Matches zero or more occurrences of the patterns provided
* `@(pattern|pat*|pat?erN)` Matches exactly one of the patterns
provided

## If you find a mistake, don't be lazy, write. Thank you.
## Pull request welcome
