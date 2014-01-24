(function(name, definition){
  if (typeof module != 'undefined') {
    definition(require, exports, module);
  } else if (typeof define == 'function' && typeof define.amd == 'object') {
    define(definition);
  } else {
    module = { exports: {} };
    require = function(name) { return window[name]; };
    window[name] = definition(require, module.exports, module) || module.exports;
    module = require = undefined;
  }
}('view', function(require, exports, module) {

'use strict';

/**
 * Depencies
 */

var events = require('events');

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

exports = module.exports = events({});

/**
 * Base view class. Accepts
 * or creates a root element
 * which we template into.
 *
 * @constructor
 */
var Base = exports.Base = function(options){
  options = options || {};
  this.el = options.el || this.el || this.createElement(this.tag);
  this.el.id = this.el.id || ('view' + counter++);
  this.attachedPlugins = [];
  this.els = {};

  if (!this.el.className) {
    if (this.name) this.el.className = this.name;
    if (this.className) this.el.className += ' ' + this.className;
  }

  // Wrap the user defined render,
  // method with event hooks.
  this.render = this.wrappedRender();

  // Include base plugins and class plugins
  this.plugins = this.plugins.concat(Base.prototype.plugins);
  this.plugins.forEach(function(plugin) { this.applyPlugin(plugin, options); }, this);
  this.initialize.apply(this, arguments);
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
 * Applys a given plugin.
 *
 * Not allowing the same
 * plugin to be added twice.
 *
 * @param {Function} plugin
 */
proto.applyPlugin = function(plugin) {
  var plugins = this.attachedPlugins;
  var args = slice.call(arguments, 1);
  args.unshift(this);
  if (!~plugins.indexOf(plugin)) {
    plugins.push(plugin);
    plugin.apply(this, args);
  }
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
proto.wrappedRender = function() {
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
 * TODO: Make duplicate plugin
 * installs more robust.
 *
 * @param  {Function} plugin
 * @return {View}
 */
exports.plugin = function(plugin) {
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

  var includesBase = extend === BaseProto || extend instanceof Base;
  var proto = extend;

  // Add the base class ontop
  // of the proto chain if it
  // doesn't already exist.
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

}));