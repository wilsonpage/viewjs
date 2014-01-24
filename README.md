# view.js

The simple, extensible view solution. For both client and server. Web-Component ready.

```js
// Define
var MyView = view.define({
  name: 'my-view',
  render: function() {
    this.el.innerHTML = this.template();
  },
  template: function() {
    return 'hello world';
  }
});

// Create
var view = new MyView();

view.render();

view.el.innerHTML; //=> 'hello world';
```

## Plugins

View.js aims to be the thin base class on which each UI component in you application can build on top of. The library is designed to be as light as possible; encouraging additional funcitonality to be bolted on, in the form of plugins.

```js
var MyView = oneview.define({
  name: 'my-view',
  plugins: [ require('viewjs-delegate') ],
  initialize: function() {
    this.delegate('click', 'button', function() {
      alert('button clicked');
    });
  },
  render: function() {
    this.el.innerHTML = this.template();
  },
  template: function() {
    return '<button>click me</button>';
  }
});
```

## Web-Component Ready

View.js has been designed around the web-components Custom-Elements spec. The viewjs-custom-element plugin give you the ability to upgrade any defined view to a custom-element.

```js
var MyView = view.define({ name: 'my-view' }).register();
```

Views can then be instantiated in a variety of ways,

```js
var view2 = new MyView();
var view1 = document.createElement('my-view');
```

or as HTML,

```html
<my-view></my-view>
```

## Encapsulated styling

The viewjs-css plugin provides an encapsulated styling solution based around scoped stylesheets. This means that stylesheets sit alongside markup, and only get parsed when the view component lands in the DOM.

```js
// Attach the plugin
view.plugin(require('viewjs-css'));

var MyView = view.define({
  name: 'my-view',
  css: 'h1: { color: red }',
  template: function() {
    return '<h1>hello world</h1>';
  }
});

var myview = new MyView();

myview.render();
myview.innerHTML; //=> <style scoped>h1 { color: red; }</style><h1>hello world</h1>
```

Writing CSS inside a JS file isn't the nicest of workflows, so it is advisable to use Browserify or Require.js to include the required CSS text string at build time.

```js
var MyView = view.define({
  name: 'my-view',
  css: fs.readFileSync('./style.css'),
  template: function() {
    return '<h1>hello world</h1>';
  }
});
```
or

```js
define(function(require) {

var view = require('viewjs');
var css = require('text!./style.css');

var MyView = view.define({
  name: 'my-view',
  css: css,
  template: function() {
    return '<h1>hello world</h1>';
  }
});

return MyView;

});
```

This makes our UI components fully transportable. A single built JS file contains everything we need to render a fully working view component!
