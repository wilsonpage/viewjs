function umd(e,t){if(typeof define=="function")return t(define);if(typeof module=="object")return t(function(e){e(require,exports,module)});var n={exports:{}},r=function(e){return window[e]};t(function(t){window[e]=t(r,n.exports,n)||n.exports})}(function(){function n(t){if(!(this instanceof n))return new n(t);if(t)return r(t,e)}function r(e,t){for(var n in t)e[n]=t[n];return e}var e=n.prototype,t=[].slice;e.on=function(e,t){return this._cbs=this._cbs||{},(this._cbs[e]||(this._cbs[e]=[])).push(t),this},e.off=function(e,t){this._cbs=this._cbs||{};if(!e)return this._cbs={};if(!t)return delete this._cbs[e];var n=this._cbs[e]||[],r;while(n&&~(r=n.indexOf(t)))n.splice(r,1);return this},e.fire=function(e){this._cbs=this._cbs||{};var n=e.name||e,r=e.ctx||this,i=this._cbs[n];if(i){var s=t.call(arguments,1),o=t.call(i);while(o.length)o.shift().apply(r,s)}return this},typeof exports=="object"?module.exports=n:typeof define=="function"&&define.amd?define("evt",[],function(){return n}):window.evt=n})(),umd("view",function(e){e("view",["require","exports","module","evt"],function(e,t,n){function c(e){var t=function(){};return t.prototype=e,new t}function h(e,t){for(var n in t)e[n]=t[n];return e}var r=e("evt"),i={}.hasOwnProperty,s=function(){},o=[].slice,u=1;t=n.exports=r({});var a=t.Base=function(e){e=e||{},this.el=e.el||this.el||this.createElement(this.tag),this.el.id=this.el.id||"view"+u++,this.attachedPlugins=[],this.els={},this.el.className||(this.name&&(this.el.className=this.name),this.className&&(this.el.className+=" "+this.className)),this.render=this.wrappedRender(),this.plugins=this.plugins.concat(a.prototype.plugins),this.plugins.forEach(function(t){this.applyPlugin(t,e)},this),this.initialize.apply(this,arguments)},f=r(a.prototype);f.tag="div",f.name="unnamed",f.plugins=[],f.applyPlugin=function(e){var t=this.attachedPlugins,n=o.call(arguments,1);n.unshift(this),~t.indexOf(e)||(t.push(e),e.apply(this,n))},f.appendTo=function(e,t){if(!e)return this;var n=t&&t.silent;return n||this.fire("before insert"),e.appendChild(this.el),n||this.fire("insert"),this},f.prependTo=function(e,t){if(!e)return this;var n=t&&t.silent,r=e.firstChild;return n||this.fire("before insert"),r?e.insertBefore(this.el,r):this.appendTo(e),n||this.fire("insert"),this},f.find=function(e){return this.el.querySelector(e)},f.inDOM=function(){var e=this.el.parentNode,t=document.body;while(e&&e!==t)e=e.parentNode;return e===t},f.remove=function(e){var t=e&&e.silent,n=this.el.parentNode;return n&&(t||this.fire("before remove"),n.removeChild(this.el),t||this.fire("remove")),this},f.destroy=function(e){var t=e&&e.noRemove,n=e&&e.silent;t||this.remove(),n||this.fire("destroy"),this.el=null},f.toHTML=f.html=function(){return this.el.outerHTML},f.toString=function(){return"[object View]"},f.initialize=s,f.template=function(){return""},f.render=function(){return this.el.innerHTML=this.template(),this},f.wrappedRender=function(){var e=this.render;return function(){this.fire("before render");var t=e.apply(this,arguments);return this.fire("render"),t||this}},t.plugin=t.install=function(e){var t=this.installedPlugins;if(e.install&&!~t.indexOf(e))return e.install(this),e.installed=!0,this;var n=a.prototype.plugins;return~n.indexOf(e)||n.push(e),this},t.installedPlugins=[],t.define=function(e){var t=function(){a.apply(this,arguments)},n=a.prototype,r=e.extends||n;typeof r=="function"&&(r=r.prototype);var i=r===n||r instanceof a,s=r;return i||(s=c(r),h(s,n)),s=c(s),t.prototype=h(s,e),l[e.name]=t};var l=t.defined={};f.createElement=function(e){return document.createElement(e)},f.mixin=function(e){h(this,e)}})}),define("main",["require","view"],function(e){var t=e("view");console.log(t)});