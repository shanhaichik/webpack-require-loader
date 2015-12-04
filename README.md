# webpack-require-loader
Require a whole directory of trees in bulk

## Install

`npm i require-loader --save-dev`

## Usage
Add in your code comment:
```js
//@require "./modules/**/index.js"

//@require "./**/!(index|config|run)*"

//@require "./**/*"
```

### webpack.config.js
```js
{
	test: /\.js$/,
    loader: 'test-bulk?import[]=angular',
}

OR

loaders: ['ng-annotate','babel?optional[]=runtime','require?import[]=angular,import[]=$=jquery,params={ip:0.0.0.0}']
```

### Params

Param | Description
------------|-------
`import` | `import modules in required scripts`
`params` | `import params in required scripts. params = var papams = {ip:0.0.0.0}`

## If you find a mistake, don't be lazy, write. Thank you.