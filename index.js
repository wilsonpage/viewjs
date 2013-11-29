(function(){

// Support AMD, CommonJS and window
if (typeof define !== 'function') {
  var define = typeof module === 'object'
    ? function(fn) { module.exports = fn(require, exports, module); }
    : function(fn) { window['view'] = fn(require, exports, module) || module.exports; };
  if (typeof require !== 'function') var require = function(name) { return window[name]; };
  if (typeof module !== 'object') var module = { exports: {} };
  if (typeof exports !== 'object') var exports = module.exports;
}

define(function(require, exports, module) {
'use strict';

/**
 * Depencies
 */

var events = require('event');

/**
 * Locals
 */

var has = {}.hasOwnProperty;
var noop = function(){};
var counter = 1;

/**
 * Exports
 */

module.exports = View;

/**
 * Base view class. Accepts
 * or creates a root element
 * which we template into.
 *
 * @constructor
 */
function View(options){
  options = options || {};
  this.el = options.el || this.el || document.createElement(this.tag);
  this.el.id = this.el.id || ('view' + counter++);
  this.attachedPlugins = [];
  this.els = {};

  if (!this.el.className) {
    if (this.name) this.el.className += ' ' + this.name;
    if (this.className) this.el.className += ' ' + this.className;
  }

  // Init all plugins
  this.plugins.forEach(this.applyPlugin, this);

  // TODO: If using view-children these events
  // will bubble, which we don't want to happen.
  this.fire('before initialize', options);
  this.initialize.apply(this, arguments);
  this.fire('initialize', options);
}

/**
 * Base view prototype,
 * mixed in event emitter.
 *
 * @type {Object}
 */
var proto = events(View.prototype);

/**
 * Default tagName
 *
 * @type {String}
 */
proto.tag = 'div';

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
  if (!~plugins.indexOf(plugin)) {
    plugins.push(plugin);
    plugin(this);
  }
};

/**
 * Appends the root element
 * to the given parent.
 *
 * @param  {Element} parent
 * @return {View}
 */
proto.appendTo = function(parent) {
  if (!parent) return this;
  parent.appendChild(this.el);
  this.fire('inserted');
  return this;
};

/**
 * Prepends the root element
 * to the given parent.
 *
 * @param  {Element} parent
 * @return {View}
 */
proto.prependTo = function(parent) {
  if (!parent) return this;
  var first = parent.firstChild;

  if (first) parent.insertBefore(this.el, first);
  else this.appendTo(parent);

  this.fire('inserted');
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
  if (!parent) return this;
  parent.removeChild(this.el);
  if (!silent) this.fire('remove');
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
  if (!noRemove) this.remove();
  this.fire('destroy');
  this.el = null;
};

// Overwrite as required
proto.initialize = noop;
proto.template = function() { return ''; };

/**
 * Adds a plugin to the
 * base class, meaning that
 * it is applied to all views
 * that extend from it.
 *
 * @param  {Function} plugin
 * @return {View}
 */
View.plugin = function(plugin) {
  var plugins = this.prototype.plugins;
  if (!~plugins.indexOf(plugin)) {
    plugins.push(plugin);
  }
  return this;
};

// Allow base view
// to be extended
View.extend = extend;

/**
 * Extends the base view
 * class with the given
 * properties.
 *
 * TODO: Pull this out to
 * standalone module.
 *
 * @param  {Object} properties
 * @return {Function}
 */
function extend(props) {
  var Parent = this;

  // The child class constructor
  // just calls the parent constructor
  var Extended = function(){
    Parent.apply(this, arguments);
  };

  // Base the Child prototype
  // on the View's prototype.
  var C = function(){};
  C.prototype = Parent.prototype;
  Extended.prototype = new C();

  // Add reference to the constructor
  Extended.prototype.constructor = Extended;

  // Allow new classes to
  // extend from this class.
  Extended.extend = View.extend;
  Extended.plugin = View.plugin;

  if (props.plugins) {
    props.plugins = Parent.prototype.plugins.concat(props.plugins);
  }

  mixin(Extended.prototype, props);

  return Extended;
}

/**
 * Mixes in the properties
 * of the second object into
 * the first.
 *
 * @param  {Object} a
 * @param  {Object} b
 * @return {Object}
 */
function mixin(a, b) {
  for (var key in b) a[key] = b[key];
  return a;
}

});
})();