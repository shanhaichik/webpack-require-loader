# How can use with angular

## webpack.config
```javascript
// JS
loaders: [
  {
    test: /\.js$/,
    loaders: ['ng-annotate','babel','required?import[]=angular'],
    exclude: /node_modules/
  },
  {
    test: /\.html$/,
    loader: "ng-cache",
    exclude: /node_modules/
  }
]

// CSS
cssLoader = {
  test: /\.css$/,
  loader: ExtractTextPlugin.extract("style", "css?sourceMap!postcss!required")
}
```

## Use in App
```
.
+-- components
|   +-- module-1
|       +-- components
|       +-- views
|       +-- config.js
|       +-- index.js
|   +-- module-2
|       +-- components
|       +-- views
|       +-- config.js
|       +-- index.js
+-- views
+-- config.js
+-- run.js
+-- app.js
```

**App.js**
```javascript
import angular from 'angular';

//@require "./components/**/index.js"
//@require "./views/**/*.html"

angular.module('sep', ['module-1', 'module-2']);
```

**components/module-1/index.js**
```javascript
// if add ?import[]=angular in webpack config, you don't need import angular
import OnConfig from './config';

export default angular.module('module-1', []).config(OnConfig);
//@require "./**/!(index|config|run)*"
```

## Use ng-cache-loader
When using the **// @ require "./**/*.html"** with angular, firstly it needs to be installed and configured loader [ng-cache-loader](https://www.npmjs.com/package/ng-cache-loader). Secondly, to apply to the template by its name. No relative paths.
```javascript
// Router
.state('app', {
      url: 'hello',
      title: 'Some page',
      views: {
        '': {
          template: 'templatePage.html'
        }
      }
    });

// Component
APP.component('someTable', {
  controller: someTableCtrl,
  templateUrl: 'some-table.html'
});


// ng-include directive
<div ng-include="'my-template.html'"></div>
```
