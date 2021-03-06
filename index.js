umd(function(define) {
define(function(require, exports, module) {
'use strict';

/**
 * Depencies
 */

var events = require('evt');

/**
 * Locals
 */

var has = {}.hasOwnProperty;
var noop = function(){};
var slice = [].slice;
var counter = 1;

/**
 * Exports
 */

exports = module.exports = events(view);

/**
 * Initialize a new view from
 * a pre-existing definition.
 *
 * @param  {Element|Object} param
 * @return {[type]}    [description]
 */
function view(config) {
  var View;
  if (config instanceof Element) {
    View = viewjs.get(config.getAttribute('name'));
    return View && new View({ el: config });
  } else if (config) {
    View = viewjs.get(config.name || config.view || config.module);
    return View && new View(config);
  }
}

/**
 * Base view class. Accepts
 * or creates a root element
 * which we template into.
 *
 * options:
 *
 *   - `el` {HTMLElement} Pre-existing root element
 *
 * @constructor
 */
var Base = exports.Base = function(options){
  if (this.initialized) return;

  options = options || {};
  this.el = options.el || this.el || this.createElement(this.tag);
  this.el.setAttribute('name', this.name);
  this.el.id = this.el.id || ('view' + counter++);
  this.attachedPlugins = [];
  this.els = {};

  // Mixin any attribute options
  // found on the root elmement
  mixin(options, this.attrOptions());

  if (!this.el.className) {
    if (this.name) this.el.className = this.name;
    if (this.className) this.el.className += ' ' + this.className;
  }

  // Wrap the user defined render,
  // method with event hooks.
  this._render = this.render;
  this.render = this.wrapRender();

  // Include base plugins and class plugins
  this.plugins = this.plugins.concat(Base.prototype.plugins);
  this.plugins.forEach(function(plugin) { this.install(plugin, options); }, this);
  this.initialize.apply(this, arguments);
  this.initialized = true;
};

/**
 * Base view prototype,
 * mixed in event emitter.
 *
 * @type {Object}
 */
var proto = events(Base.prototype);

/**
 * Default tagName
 *
 * @type {String}
 */
proto.tag = 'div';
proto.name = 'unnamed';

/**
 * An aray of plugins to
 * apply to every view.
 *
 * @type {Array}
 */
proto.plugins = [];

/**
 * Installs a plugin.
 *
 * Not allowing the same
 * plugin to be added twice.
 *
 * @param {Function} plugin
 */
proto.install = function(plugin) {
  var plugins = this.attachedPlugins;
  var args = slice.call(arguments, 1);
  args.unshift(this);
  if (!~plugins.indexOf(plugin)) {
    plugins.push(plugin);
    plugin.apply(this, args);
  }
};

proto.attrOptions = function() {
  var attrs = this.el.attributes;
  var i = attrs.length;
  var ignore = /^view-/;
  var options = {};
  var name;

  while (i--) {
    name = attrs[i].name;
    if (ignore.test(name)) continue;
    switch (name) {
      case 'id':
      case 'class': break;
      default: options[name] = attrs[i].nodeValue;
    }
  }

  return options;
};

/**
 * Appends the root element
 * to the given parent.
 *
 * @param  {Element} parent
 * @return {View}
 */
proto.appendTo = function(parent, options) {
  if (!parent) return this;
  var silent = options && options.silent;
  if (!silent) this.fire('before insert');
  parent.appendChild(this.el);
  if (!silent) this.fire('insert');
  return this;
};

/**
 * Prepends the root element
 * to the given parent.
 *
 * @param  {Element} parent
 * @return {View}
 */
proto.prependTo = function(parent, options) {
  if (!parent) return this;
  var silent = options && options.silent;
  var first = parent.firstChild;
  if (!silent) this.fire('before insert');
  if (first) parent.insertBefore(this.el, first);
  else this.appendTo(parent);
  if (!silent) this.fire('insert');
  return this;
};

/**
 * Convenient shorthand
 * querySelector.
 *
 * @param  {String} query
 * @return {Element|null}
 */
proto.find = function(query) {
  return this.el.querySelector(query);
};

/**
 * Detects if the view's
 * root element is in the
 * document.
 *
 * @return {Boolean}
 */
proto.inDOM = function() {
  var target = this.el.parentNode;
  var body = document.body;
  while (target && target !== body) {
    target = target.parentNode;
  }
  return target === body;
};

/**
 * Removes the element from
 * its current DOM location.
 *
 * @param  {Object} options
 * @return {View}
 */
proto.remove = function(options) {
  var silent = options && options.silent;
  var parent = this.el.parentNode;
  if (parent) {
    if (!silent) this.fire('before remove');
    parent.removeChild(this.el);
    if (!silent) this.fire('remove');
  }
  return this;
};

/**
 * Removes the element from
 * it's current context, firing
 * a 'destroy' event to allow
 * views to perform cleanup.
 *
 * Then clears any internal
 * references to aid GC.
 *
 * @return {[type]} [description]
 */
proto.destroy = function(options) {
  var noRemove = options && options.noRemove;
  var silent = options && options.silent;
  if (!noRemove) this.remove();
  if (!silent) this.fire('destroy');
  this.el = null;
};

proto.toHTML = proto.html = function() {
  return this.el.outerHTML;
};

proto.toString = function() {
  return '[object View]';
};

// Overwrite as required
proto.initialize = noop;
proto.template = function() { return ''; };
proto.render = function() {
  this.el.innerHTML = this.template();
  return this;
};

/**
 * Adds event hooks around
 * user defined render method.
 *
 * @private
 */
proto.wrapRender = function() {
  var render = this.render;
  return function() {
    this.fire('before render');
    var out = render.apply(this, arguments);
    this.fire('render');
    return out || this;
  };
};

/**
 * By default a plugin will
 * be added the the base plugins
 * array, and applied to each
 * view that extends from this.
 *
 * If your plugin needs to do
 * something other than this,
 * simply include an 'install'
 * key to perform a custom
 * installation.
 *
 * @param  {Function} plugin
 * @return {View}
 */
exports.plugin = exports.install = function(plugin) {
  var installed = this.installedPlugins;
  if (plugin.install && !~installed.indexOf(plugin)) {
    plugin.install(this);
    plugin.installed = true;
    return this;
  }

  var plugins = Base.prototype.plugins;
  if (!~plugins.indexOf(plugin)) {
    plugins.push(plugin);
  }

  return this;
};

// Reference to already
// installeld plugins
exports.installedPlugins = [];

exports.define = function(props) {
  var NewView = function() { Base.apply(this, arguments); };
  var BaseProto = Base.prototype;
  var extend = props.extends || BaseProto;

  // Allow users to pass the constructor
  // function as well as the prototype
  if (typeof extend === 'function') {
    extend = extend.prototype;
  }

  var includesBase = extend === BaseProto || extend.toString() === '[object View]';
  var proto = extend;

  // Add the base class ontop
  // of the proto chain if it
  // doesn't already exist.
  //
  // TODO: Surely the Base class
  // should be below the extended
  // class in cas any of the extend
  // class properties are designed
  // to override the Bases'.
  if (!includesBase) {
    proto = create(extend);
    mixin(proto, BaseProto);
  }

  // Extend the proto chain,
  // and mixin the new properties
  proto = create(proto);
  NewView.prototype = mixin(proto, props);
  return defined[props.name] = NewView;
};

exports.get = function(name) {
  return defined[name];
};

// Stores references to defined views
var defined = exports.defined = {};

function create(proto) {
  var A = function(){};
  A.prototype = proto;
  return new A();
}

proto.createElement = function(tag) {
  return document.createElement(tag);
};

proto.mixin = function(props) {
  mixin(this, props);
};

/**
 * Mixes in properies of object
 * 'b' that object 'a' doesn't have.
 *
 * @param  {Object} a
 * @param  {Object} b
 */
function mixin(a, b) {
  for (var key in b) a[key] = b[key];
  return a;
}

});},'viewjs');function umd(fn,n){
if(typeof define=='function')return fn(define);
if(typeof module=='object')return fn(function(c){c(require,exports,module);});
var m={exports:{}},r=function(n){return window[n];};fn(function(c){window[n]=c(r,m.exports,m)||m.exports;});}