# webpack-require-loader
Require a whole directory of trees in bulk

## Install

`npm i required-loader --save-dev`

## Usage
Add in your code comment:
```js
//@require "./modules/**/index.js"

//@require "./modules/**/index.js?import[]=angular,import[]=$=jquery,go={hello:'world'}"
(If the parameters are set in the webpack.config.js file and in @require, they both will be imported into the included files)

//@require "./**/!(index|config|run)*"

//@require "./**/*"

//@require "./**/*.html"
```

### webpack.config.js
```js
{
	test: /\.js$/,
    loader: 'required?import[]=angular',
}

OR

loaders: ["ng-annotate","babel?optional[]=runtime","required?import[]=angular,import[]=$=jquery,params={ip:'0.0.0.0'}"]
```

### Params

Param | Description
------------|-------
`import` | `import modules in required scripts`
`params` | `import params in required scripts. params = var papams = {hello:'0.0.0.0'}`

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