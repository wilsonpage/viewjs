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
  this.el = options.el || document.createElement(this.tag);
  this.els = {};

  if (this.className) {
    this.el.className += this.className;
  }

  // Initialize our 'faux' constructor
  this.initialize.apply(this, arguments);
}

/**
 * Base view prototype,
 * mixed in event emitter.
 *
 * @type {Object}
 */
View.prototype = events({
  tag: 'div',
  initialize: function(){},
  appendTo: function(parent) {
    parent.appendChild(this.el);
    return this;
  },
  prependTo: function(parent) {
    var first = parent.firstChild;

    if (first) parent.insertBefore(this.el, first);
    else this.appendTo(parent);

    return this;
  },
  find: function(query) {
    return this.el.querySelector(query);
  },
  remove: function(options) {
    var silent = options && options.silent;
    var parent = this.el.parentNode;
    if (parent) {
      parent.removeChild(this.el);
      if (!silent) this.fire('remove');
    }
  },
  destroy: function() {
    this.remove({ silent: true });
    this.fire('destroy');
  }
});

/**
 * Extends the base view
 * class with the given
 * properties.
 *
 * @param  {Object} properties
 * @return {Function}
 */
View.extend = function(Child) {
  var Parent = this;

  Child = Child || function(){};

  // The child class constructor
  // just calls the parent constructor
  var Extended = function(){
    Parent.apply(this, arguments);
    Child.apply(this, arguments);
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

  mixin(Extended.prototype, Child.prototype);

  return Extended;
};

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