'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var cnbuilder = require('cnbuilder');
var React = require('react');
var zoomLevel = require('zoom-level');
var reactDraggable = require('react-draggable');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

var doc = (typeof document === "undefined" ? "undefined" : _typeof(document)) === "object" ? document : null;
var isUndef = function isUndef(v) {
  return typeof v === "undefined";
};
var isFun = function isFun(v) {
  return typeof v === "function";
};
var isNum = function isNum(v) {
  return typeof v === "number";
};
/**
 * @description Will return renderer result if presented, div element otherwise.
 * If renderer is presented it'll receive `elementRef` function which should be used as HTMLElement's ref.
 *
 * @param props {ElementPropsWithElementRefAndRenderer}
 * @param elementRef {ElementRef}
 */

var renderDivWithRenderer = function renderDivWithRenderer(props, elementRef) {
  if (isFun(props.renderer)) {
    props.elementRef = elementRef;
    var renderer = props.renderer;
    delete props.renderer;
    return renderer(props);
  }

  delete props.elementRef;
  return React__namespace.createElement("div", __assign({}, props, {
    ref: elementRef
  }));
};

var getInnerSize = function getInnerSize(el, dimension, padding1, padding2) {
  var styles = getComputedStyle(el);

  if (styles.boxSizing === "border-box") {
    return Math.max(0, (parseFloat(styles[dimension]) || 0) - (parseFloat(styles[padding1]) || 0) - (parseFloat(styles[padding2]) || 0));
  }

  return parseFloat(styles[dimension]) || 0;
};
/**
 * @description Return element's height without padding
 */


var getInnerHeight = function getInnerHeight(el) {
  return getInnerSize(el, "height", "paddingTop", "paddingBottom");
};
/**
 * @description Return element's width without padding
 */

var getInnerWidth = function getInnerWidth(el) {
  return getInnerSize(el, "width", "paddingLeft", "paddingRight");
};
/**
 * @description Return unique UUID v4
 */

var uuid = function uuid() {
  var uuid = "";

  for (var i = 0; i < 32; i++) {
    if (i === 8 || i === 20) {
      uuid += "-" + (Math.random() * 16 | 0).toString(16);
    } else if (i === 12) {
      uuid += "-4";
    } else if (i === 16) {
      uuid += "-" + (Math.random() * 16 | 0 & 3 | 8).toString(16);
    } else {
      uuid += (Math.random() * 16 | 0).toString(16);
    }
  }

  return uuid;
};
/**
 * @description Calculate thumb size for given viewport and track parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} minimalSize - Minimal thumb's size
 * @param {number} maximalSize - Maximal thumb's size
 */

var calcThumbSize = function calcThumbSize(contentSize, viewportSize, trackSize, minimalSize, maximalSize) {
  if (viewportSize >= contentSize) {
    return 0;
  }

  var thumbSize = viewportSize / contentSize * trackSize;
  isNum(maximalSize) && (thumbSize = Math.min(maximalSize, thumbSize));
  isNum(minimalSize) && (thumbSize = Math.max(minimalSize, thumbSize));
  return thumbSize;
};
/**
 * @description Calculate thumb offset for given viewport, track and thumb parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} thumbSize - Thumb size
 * @param {number} scroll - Scroll value to represent
 */

var calcThumbOffset = function calcThumbOffset(contentSize, viewportSize, trackSize, thumbSize, scroll) {
  if (!scroll || !thumbSize || viewportSize >= contentSize) {
    return 0;
  }

  return (trackSize - thumbSize) * scroll / (contentSize - viewportSize);
};
/**
 * @description Calculate scroll for given viewport, track and thumb parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} thumbSize - Thumb size
 * @param {number} thumbOffset - Thumb's offset representing the scroll
 */

var calcScrollForThumbOffset = function calcScrollForThumbOffset(contentSize, viewportSize, trackSize, thumbSize, thumbOffset) {
  if (!thumbOffset || !thumbSize || viewportSize >= contentSize) {
    return 0;
  }

  return thumbOffset * (contentSize - viewportSize) / (trackSize - thumbSize);
};
/**
 * @description Returns scrollbar width specific for current environment. Can return undefined if DOM is not ready yet.
 */

var getScrollbarWidth = function getScrollbarWidth(force) {
  if (force === void 0) {
    force = false;
  }

  if (!doc) {
    return getScrollbarWidth._cache = 0;
  }

  if (!force && !isUndef(getScrollbarWidth._cache)) {
    return getScrollbarWidth._cache;
  }

  var el = doc.createElement("div");
  el.setAttribute("style", "position:absolute;width:100px;height:100px;top:-999px;left:-999px;overflow:scroll;");
  doc.body.appendChild(el);
  /* istanbul ignore next */

  if (el.clientWidth === 0) {
    // Do not even cache this value because there is no calculations. Issue https://github.com/xobotyi/react-scrollbars-custom/issues/123
    doc.body.removeChild(el);
    return;
  }

  getScrollbarWidth._cache = 100 - el.clientWidth;
  doc.body.removeChild(el);
  return getScrollbarWidth._cache;
};
/**
 * @description Detect need of horizontal scroll reverse while RTL.
 */

var shouldReverseRtlScroll = function shouldReverseRtlScroll(force) {
  if (force === void 0) {
    force = false;
  }

  if (!force && !isUndef(shouldReverseRtlScroll._cache)) {
    return shouldReverseRtlScroll._cache;
  }

  if (!doc) {
    return shouldReverseRtlScroll._cache = false;
  }

  var el = doc.createElement("div");
  var child = doc.createElement("div");
  el.appendChild(child);
  el.setAttribute("style", "position:absolute;width:100px;height:100px;top:-999px;left:-999px;overflow:scroll;direction:rtl");
  child.setAttribute("style", "width:1000px;height:1000px");
  doc.body.appendChild(el);
  el.scrollLeft = -50;
  shouldReverseRtlScroll._cache = el.scrollLeft === -50;
  doc.body.removeChild(el);
  return shouldReverseRtlScroll._cache;
};

var Emittr =
/** @class */
function () {
  function Emittr(maxHandlers) {
    if (maxHandlers === void 0) {
      maxHandlers = 10;
    }

    this.setMaxHandlers(maxHandlers);
    this._handlers = Object.create(null);
  }

  Emittr._callEventHandlers = function (emitter, handlers, args) {
    if (!handlers.length) {
      return;
    }

    if (handlers.length === 1) {
      Reflect.apply(handlers[0], emitter, args);
      return;
    }

    handlers = __spreadArrays(handlers);
    var idx;

    for (idx = 0; idx < handlers.length; idx++) {
      Reflect.apply(handlers[idx], emitter, args);
    }
  };

  Emittr.prototype.setMaxHandlers = function (count) {
    if (!isNum(count) || count <= 0) {
      throw new TypeError("Expected maxHandlers to be a positive number, got '" + count + "' of type " + _typeof(count));
    }

    this._maxHandlers = count;
    return this;
  };

  Emittr.prototype.getMaxHandlers = function () {
    return this._maxHandlers;
  };

  Emittr.prototype.emit = function (name) {
    var args = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }

    if (_typeof(this._handlers[name]) !== "object" || !Array.isArray(this._handlers[name])) {
      return false;
    }

    Emittr._callEventHandlers(this, this._handlers[name], args);

    return true;
  };

  Emittr.prototype.on = function (name, handler) {
    Emittr._addHandler(this, name, handler);

    return this;
  };

  Emittr.prototype.prependOn = function (name, handler) {
    Emittr._addHandler(this, name, handler, true);

    return this;
  };

  Emittr.prototype.once = function (name, handler) {
    if (!isFun(handler)) {
      throw new TypeError("Expected event handler to be a function, got " + _typeof(handler));
    }

    Emittr._addHandler(this, name, this._wrapOnceHandler(name, handler));

    return this;
  };

  Emittr.prototype.prependOnce = function (name, handler) {
    if (!isFun(handler)) {
      throw new TypeError("Expected event handler to be a function, got " + _typeof(handler));
    }

    Emittr._addHandler(this, name, this._wrapOnceHandler(name, handler), true);

    return this;
  };

  Emittr.prototype.off = function (name, handler) {
    Emittr._removeHandler(this, name, handler);

    return this;
  };

  Emittr.prototype.removeAllHandlers = function () {
    var handlers = this._handlers;
    this._handlers = Object.create(null);
    var removeHandlers = handlers["removeHandler"];
    delete handlers["removeHandler"];
    var idx, eventName;

    for (eventName in handlers) {
      for (idx = handlers[eventName].length - 1; idx >= 0; idx--) {
        Emittr._callEventHandlers(this, removeHandlers, [eventName, handlers[eventName][idx].handler || handlers[eventName][idx]]);
      }
    }

    return this;
  };

  Emittr.prototype._wrapOnceHandler = function (name, handler) {
    var onceState = {
      fired: false,
      handler: handler,
      wrappedHandler: undefined,
      emitter: this,
      event: name
    };

    var wrappedHandler = Emittr._onceWrapper.bind(onceState);

    onceState.wrappedHandler = wrappedHandler;
    wrappedHandler.handler = handler;
    wrappedHandler.event = name;
    return wrappedHandler;
  };

  Emittr._addHandler = function (emitter, name, handler, prepend) {
    if (prepend === void 0) {
      prepend = false;
    }

    if (!isFun(handler)) {
      throw new TypeError("Expected event handler to be a function, got " + _typeof(handler));
    }

    emitter._handlers[name] = emitter._handlers[name] || [];
    emitter.emit("addHandler", name, handler);
    prepend ? emitter._handlers[name].unshift(handler) : emitter._handlers[name].push(handler);
    return emitter;
  };

  Emittr._onceWrapper = function _onceWrapper() {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    if (!this.fired) {
      this.fired = true;
      this.emitter.off(this.event, this.wrappedHandler);
      Reflect.apply(this.handler, this.emitter, args);
    }
  };

  Emittr._removeHandler = function (emitter, name, handler) {
    if (!isFun(handler)) {
      throw new TypeError("Expected event handler to be a function, got " + _typeof(handler));
    }

    if (isUndef(emitter._handlers[name]) || !emitter._handlers[name].length) {
      return emitter;
    }

    var idx = -1;

    if (emitter._handlers[name].length === 1) {
      if (emitter._handlers[name][0] === handler || emitter._handlers[name][0].handler === handler) {
        idx = 0;
        handler = emitter._handlers[name][0].handler || emitter._handlers[name][0];
      }
    } else {
      for (idx = emitter._handlers[name].length - 1; idx >= 0; idx--) {
        if (emitter._handlers[name][idx] === handler || emitter._handlers[name][idx].handler === handler) {
          handler = emitter._handlers[name][idx].handler || emitter._handlers[name][idx];
          break;
        }
      }
    }

    if (idx === -1) {
      return emitter;
    }

    idx === 0 ? emitter._handlers[name].shift() : emitter._handlers[name].splice(idx, 1);
    emitter.emit("removeHandler", name, handler);
    return emitter;
  };

  return Emittr;
}();

var RAFLoop =
/** @class */
function () {
  function RAFLoop() {
    var _this = this;
    /**
     * @description List of targets to update
     */


    this.targets = [];
    /**
     * @description ID of requested animation frame. Valuable only if loop is active and has items to iterate.
     */

    this.animationFrameID = 0;
    /**
     * @description Loop's state.
     */

    this._isActive = false;
    /**
     * @description Start the loop if it wasn't yet.
     */

    this.start = function () {
      if (!_this._isActive && _this.targets.length) {
        _this._isActive = true;
        _this.animationFrameID && cancelAnimationFrame(_this.animationFrameID);
        _this.animationFrameID = requestAnimationFrame(_this.rafCallback);
      }

      return _this;
    };
    /**
     * @description Stop the loop if is was active.
     */


    this.stop = function () {
      if (_this._isActive) {
        _this._isActive = false;
        _this.animationFrameID && cancelAnimationFrame(_this.animationFrameID);
        _this.animationFrameID = 0;
      }

      return _this;
    };
    /**
     * @description Add target to the iteration list if it's not there.
     */


    this.addTarget = function (target, silent) {
      if (silent === void 0) {
        silent = false;
      }

      if (_this.targets.indexOf(target) === -1) {
        _this.targets.push(target);

        _this.targets.length === 1 && !silent && _this.start();
      }

      return _this;
    };
    /**
     * @description Remove target from iteration list if it was there.
     */


    this.removeTarget = function (target) {
      var idx = _this.targets.indexOf(target);

      if (idx !== -1) {
        _this.targets.splice(idx, 1);

        _this.targets.length === 0 && _this.stop();
      }

      return _this;
    };
    /**
     * @description Callback that called each animation frame.
     */


    this.rafCallback = function () {
      if (!_this._isActive) {
        return 0;
      }

      for (var i = 0; i < _this.targets.length; i++) {
        !_this.targets[i]._unmounted && _this.targets[i].update();
      }

      return _this.animationFrameID = requestAnimationFrame(_this.rafCallback);
    };
  }

  Object.defineProperty(RAFLoop.prototype, "isActive", {
    /**
     * @description Loop's state.
     */
    get: function get() {
      return this._isActive;
    },
    enumerable: false,
    configurable: true
  });
  return RAFLoop;
}();
var Loop = new RAFLoop();

var AXIS_DIRECTION;

(function (AXIS_DIRECTION) {
  AXIS_DIRECTION["X"] = "x";
  AXIS_DIRECTION["Y"] = "y";
})(AXIS_DIRECTION || (AXIS_DIRECTION = {}));

var TRACK_CLICK_BEHAVIOR;

(function (TRACK_CLICK_BEHAVIOR) {
  TRACK_CLICK_BEHAVIOR["JUMP"] = "jump";
  TRACK_CLICK_BEHAVIOR["STEP"] = "step";
})(TRACK_CLICK_BEHAVIOR || (TRACK_CLICK_BEHAVIOR = {}));

var ScrollbarThumb =
/** @class */
function (_super) {
  __extends(ScrollbarThumb, _super);

  function ScrollbarThumb() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.initialOffsetX = 0;
    _this.initialOffsetY = 0;
    _this.lastDragData = {
      x: 0,
      y: 0,
      deltaX: 0,
      deltaY: 0,
      lastX: 0,
      lastY: 0
    };
    _this.element = null;
    _this.elementRefHack = React__namespace.createRef();

    _this.handleOnDragStart = function (ev, data) {
      if (!_this.element) {
        _this.handleOnDragStop(ev, data);

        return;
      }

      if (global.document) {
        _this.prevUserSelect = global.document.body.style.userSelect;
        global.document.body.style.userSelect = "none";
        _this.prevOnSelectStart = global.document.onselectstart;
        global.document.onselectstart = ScrollbarThumb.selectStartReplacer;
      }

      _this.props.onDragStart && _this.props.onDragStart(_this.lastDragData = {
        x: data.x - _this.initialOffsetX,
        y: data.y - _this.initialOffsetY,
        lastX: data.lastX - _this.initialOffsetX,
        lastY: data.lastY - _this.initialOffsetY,
        deltaX: data.deltaX,
        deltaY: data.deltaY
      });

      _this.element.classList.add("dragging");
    };

    _this.handleOnDrag = function (ev, data) {
      if (!_this.element) {
        _this.handleOnDragStop(ev, data);

        return;
      }

      _this.props.onDrag && _this.props.onDrag(_this.lastDragData = {
        x: data.x - _this.initialOffsetX,
        y: data.y - _this.initialOffsetY,
        lastX: data.lastX - _this.initialOffsetX,
        lastY: data.lastY - _this.initialOffsetY,
        deltaX: data.deltaX,
        deltaY: data.deltaY
      });
    };

    _this.handleOnDragStop = function (ev, data) {
      var resultData = data ? {
        x: data.x - _this.initialOffsetX,
        y: data.y - _this.initialOffsetY,
        lastX: data.lastX - _this.initialOffsetX,
        lastY: data.lastY - _this.initialOffsetY,
        deltaX: data.deltaX,
        deltaY: data.deltaY
      } : _this.lastDragData;
      _this.props.onDragEnd && _this.props.onDragEnd(resultData);
      _this.element && _this.element.classList.remove("dragging");

      if (global.document) {
        global.document.body.style.userSelect = _this.prevUserSelect;
        global.document.onselectstart = _this.prevOnSelectStart;
        _this.prevOnSelectStart = null;
      }

      _this.initialOffsetX = 0;
      _this.initialOffsetY = 0;
      _this.lastDragData = {
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: 0,
        lastX: 0,
        lastY: 0
      };
    };

    _this.handleOnMouseDown = function (ev) {
      if (!_this.element) {
        return;
      }

      ev.preventDefault();
      ev.stopPropagation();

      if (!isUndef(ev.offsetX)) {
        /* istanbul ignore next */
        _this.initialOffsetX = ev.offsetX;
        /* istanbul ignore next */

        _this.initialOffsetY = ev.offsetY;
      } else {
        var rect = _this.element.getBoundingClientRect();

        _this.initialOffsetX = (ev.clientX || ev.touches[0].clientX) - rect.left;
        _this.initialOffsetY = (ev.clientY || ev.touches[0].clientY) - rect.top;
      }
    };

    _this.elementRef = function (ref) {
      isFun(_this.props.elementRef) && _this.props.elementRef(ref);
      _this.element = ref; // @ts-ignore

      _this.elementRefHack["current"] = ref;
    };

    return _this;
  }

  ScrollbarThumb.prototype.componentDidMount = function () {
    if (!this.element) {
      this.setState(function () {
        throw new Error("<ScrollbarThumb> Element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function.");
      });
      return;
    }
  };

  ScrollbarThumb.prototype.componentWillUnmount = function () {
    this.handleOnDragStop();
    this.elementRef(null);
  };

  ScrollbarThumb.prototype.render = function () {
    var _a = this.props;
        _a.elementRef;
        var axis = _a.axis;
        _a.onDrag;
        _a.onDragEnd;
        _a.onDragStart;
        var props = __rest(_a, ["elementRef", "axis", "onDrag", "onDragEnd", "onDragStart"]);

    props.className = cnbuilder.cnb("ScrollbarsCustom-Thumb", axis === AXIS_DIRECTION.X ? "ScrollbarsCustom-ThumbX" : "ScrollbarsCustom-ThumbY", props.className);

    if (props.renderer) {
      props.axis = axis;
    }

    return React__namespace.createElement(reactDraggable.DraggableCore, {
      allowAnyClick: false,
      enableUserSelectHack: false,
      onMouseDown: this.handleOnMouseDown,
      onDrag: this.handleOnDrag,
      onStart: this.handleOnDragStart,
      onStop: this.handleOnDragStop,
      // ToDo: Fixit!
      // react-draggable developers did not update typings so there is no appropriate prop
      // @ts-ignore
      nodeRef: this.elementRefHack
    }, renderDivWithRenderer(props, this.elementRef));
  };

  ScrollbarThumb.selectStartReplacer = function () {
    return false;
  };

  return ScrollbarThumb;
}(React__namespace.Component);

var ScrollbarTrack =
/** @class */
function (_super) {
  __extends(ScrollbarTrack, _super);

  function ScrollbarTrack() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.element = null;

    _this.elementRef = function (ref) {
      isFun(_this.props.elementRef) && _this.props.elementRef(ref);
      _this.element = ref;
    };

    _this.handleClick = function (ev) {
      if (!ev || !_this.element || ev.button !== 0) {
        return;
      }

      if (isFun(_this.props.onClick) && ev.target === _this.element) {
        if (!isUndef(ev.offsetX)) {
          _this.props.onClick(ev, {
            axis: _this.props.axis,
            offset: _this.props.axis === AXIS_DIRECTION.X ? ev.offsetX : ev.offsetY
          });
        } else {
          // support for old browsers

          /* istanbul ignore next */
          var rect = _this.element.getBoundingClientRect();
          /* istanbul ignore next */


          _this.props.onClick(ev, {
            axis: _this.props.axis,
            offset: _this.props.axis === AXIS_DIRECTION.X ? (ev.clientX || ev.touches[0].clientX) - rect.left : (ev.clientY || ev.touches[0].clientY) - rect.top
          });
        }
      }

      return true;
    };

    return _this;
  }

  ScrollbarTrack.prototype.componentDidMount = function () {
    if (!this.element) {
      this.setState(function () {
        throw new Error("Element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function.");
      });
      return;
    }

    this.element.addEventListener("click", this.handleClick);
  };

  ScrollbarTrack.prototype.componentWillUnmount = function () {
    if (this.element) {
      this.element.removeEventListener("click", this.handleClick);
      this.element = null;
      this.elementRef(null);
    }
  };

  ScrollbarTrack.prototype.render = function () {
    var _a = this.props;
        _a.elementRef;
        var axis = _a.axis;
        _a.onClick;
        var props = __rest(_a, ["elementRef", "axis", "onClick"]);

    props.className = cnbuilder.cnb("ScrollbarsCustom-Track", axis === AXIS_DIRECTION.X ? "ScrollbarsCustom-TrackX" : "ScrollbarsCustom-TrackY", props.className);

    if (props.renderer) {
      props.axis = axis;
    }

    return renderDivWithRenderer(props, this.elementRef);
  };

  return ScrollbarTrack;
}(React__namespace.Component);

var style = {
  holder: {
    position: "relative",
    width: "100%",
    height: "100%"
  },
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  content: {
    boxSizing: "border-box"
  },
  track: {
    common: {
      position: "absolute",
      overflow: "hidden",
      borderRadius: 4,
      background: "rgba(0,0,0,.1)",
      userSelect: "none"
    },
    x: {
      height: 10,
      width: "calc(100% - 20px)",
      bottom: 0,
      left: 10
    },
    y: {
      width: 10,
      height: "calc(100% - 20px)",
      top: 10
    }
  },
  thumb: {
    common: {
      cursor: "pointer",
      borderRadius: 4,
      background: "rgba(0,0,0,.4)"
    },
    x: {
      height: "100%",
      width: 0
    },
    y: {
      width: "100%",
      height: 0
    }
  }
};

var pageZoomLevel = global.window ? zoomLevel.zoomLevel() : 1;
global.window && global.window.addEventListener("resize", function () {
  return pageZoomLevel = zoomLevel.zoomLevel();
}, {
  passive: true
});
var ScrollbarContext = React__namespace.createContext({
  parentScrollbar: null
});

var Scrollbar =
/** @class */
function (_super) {
  __extends(Scrollbar, _super);

  function Scrollbar(props) {
    var _this = _super.call(this, props) || this;
    /**
     * @description Get current scroll-related values.<br/>
     * If <i>force</i> if truthy - will recalculate them instead of returning cached values.
     *
     * @return ScrollState
     */


    _this.getScrollState = function (force) {
      if (force === void 0) {
        force = false;
      }

      if (_this.scrollValues && !force) {
        return __assign({}, _this.scrollValues);
      }

      var scrollState = {
        clientHeight: 0,
        clientWidth: 0,
        contentScrollHeight: 0,
        contentScrollWidth: 0,
        scrollHeight: 0,
        scrollWidth: 0,
        scrollTop: 0,
        scrollLeft: 0,
        scrollYBlocked: false,
        scrollXBlocked: false,
        scrollYPossible: false,
        scrollXPossible: false,
        trackYVisible: false,
        trackXVisible: false,
        zoomLevel: pageZoomLevel * 1,
        isRTL: undefined
      };
      var props = _this.props;
      scrollState.isRTL = _this.state.isRTL;
      scrollState.scrollYBlocked = props.noScroll || props.noScrollY;
      scrollState.scrollXBlocked = props.noScroll || props.noScrollX;

      if (_this.scrollerElement) {
        scrollState.clientHeight = _this.scrollerElement.clientHeight;
        scrollState.clientWidth = _this.scrollerElement.clientWidth;
        scrollState.scrollHeight = _this.scrollerElement.scrollHeight;
        scrollState.scrollWidth = _this.scrollerElement.scrollWidth;
        scrollState.scrollTop = _this.scrollerElement.scrollTop;
        scrollState.scrollLeft = _this.scrollerElement.scrollLeft;
        scrollState.scrollYPossible = !scrollState.scrollYBlocked && scrollState.scrollHeight > scrollState.clientHeight;
        scrollState.scrollXPossible = !scrollState.scrollXBlocked && scrollState.scrollWidth > scrollState.clientWidth;
        scrollState.trackYVisible = scrollState.scrollYPossible || props.permanentTracks || props.permanentTrackY;
        scrollState.trackXVisible = scrollState.scrollXPossible || props.permanentTracks || props.permanentTrackX;
      }

      if (_this.contentElement) {
        scrollState.contentScrollHeight = _this.contentElement.scrollHeight;
        scrollState.contentScrollWidth = _this.contentElement.scrollWidth;
      }

      return scrollState;
    };
    /**
     * @description Scroll to top border
     */


    _this.scrollToTop = function () {
      if (_this.scrollerElement) {
        _this.scrollerElement.scrollTop = 0;
      }

      return _this;
    };
    /**
     * @description Scroll to left border
     */


    _this.scrollToLeft = function () {
      if (_this.scrollerElement) {
        _this.scrollerElement.scrollLeft = 0;
      }

      return _this;
    };
    /**
     * @description Scroll to bottom border
     */


    _this.scrollToBottom = function () {
      if (_this.scrollerElement) {
        _this.scrollerElement.scrollTop = _this.scrollerElement.scrollHeight - _this.scrollerElement.clientHeight;
      }

      return _this;
    };
    /**
     * @description Scroll to right border
     */


    _this.scrollToRight = function () {
      if (_this.scrollerElement) {
        _this.scrollerElement.scrollLeft = _this.scrollerElement.scrollWidth - _this.scrollerElement.clientWidth;
      }

      return _this;
    };
    /**
     * @description Set the scrolls at given coordinates.<br/>
     * If coordinate is undefined - current scroll value will persist.
     */


    _this.scrollTo = function (x, y) {
      if (_this.scrollerElement) {
        isNum(x) && (_this.scrollerElement.scrollLeft = x);
        isNum(y) && (_this.scrollerElement.scrollTop = y);
      }

      return _this;
    };
    /**
     * @description Center the viewport at given coordinates.<br/>
     * If coordinate is undefined - current scroll value will persist.
     */


    _this.centerAt = function (x, y) {
      if (_this.scrollerElement) {
        isNum(x) && (_this.scrollerElement.scrollLeft = x - _this.scrollerElement.clientWidth / 2);
        isNum(y) && (_this.scrollerElement.scrollTop = y - _this.scrollerElement.clientHeight / 2);
      }

      return _this;
    };

    _this.update = function (force) {
      if (force === void 0) {
        force = false;
      }

      if (!_this.scrollerElement) {
        return;
      } // autodetect direction if not defined


      if (isUndef(_this.state.isRTL)) {
        _this.setState({
          isRTL: getComputedStyle(_this.scrollerElement).direction === "rtl"
        });

        return _this.getScrollState();
      }

      var scrollState = _this.getScrollState(true);

      var prevScrollState = __assign({}, _this.scrollValues);

      var props = _this.props;
      var bitmask = 0;

      if (!force) {
        prevScrollState.clientHeight !== scrollState.clientHeight && (bitmask |= 1 << 0);
        prevScrollState.clientWidth !== scrollState.clientWidth && (bitmask |= 1 << 1);
        prevScrollState.scrollHeight !== scrollState.scrollHeight && (bitmask |= 1 << 2);
        prevScrollState.scrollWidth !== scrollState.scrollWidth && (bitmask |= 1 << 3);
        prevScrollState.scrollTop !== scrollState.scrollTop && (bitmask |= 1 << 4);
        prevScrollState.scrollLeft !== scrollState.scrollLeft && (bitmask |= 1 << 5);
        prevScrollState.scrollYBlocked !== scrollState.scrollYBlocked && (bitmask |= 1 << 6);
        prevScrollState.scrollXBlocked !== scrollState.scrollXBlocked && (bitmask |= 1 << 7);
        prevScrollState.scrollYPossible !== scrollState.scrollYPossible && (bitmask |= 1 << 8);
        prevScrollState.scrollXPossible !== scrollState.scrollXPossible && (bitmask |= 1 << 9);
        prevScrollState.trackYVisible !== scrollState.trackYVisible && (bitmask |= 1 << 10);
        prevScrollState.trackXVisible !== scrollState.trackXVisible && (bitmask |= 1 << 11);
        prevScrollState.isRTL !== scrollState.isRTL && (bitmask |= 1 << 12);
        prevScrollState.contentScrollHeight !== scrollState.contentScrollHeight && (bitmask |= 1 << 13);
        prevScrollState.contentScrollWidth !== scrollState.contentScrollWidth && (bitmask |= 1 << 14);
        prevScrollState.zoomLevel !== scrollState.zoomLevel && (bitmask |= 1 << 15); // if not forced and nothing has changed - skip this update

        if (bitmask === 0) {
          return prevScrollState;
        }
      } else {
        bitmask = 32767;
      }

      if (!props.native && _this.holderElement) {
        if (bitmask & 1 << 13 && (props.translateContentSizesToHolder || props.translateContentSizeYToHolder)) {
          _this.holderElement.style.height = scrollState.contentScrollHeight + "px";
        }

        if (bitmask & 1 << 14 && (props.translateContentSizesToHolder || props.translateContentSizeXToHolder)) {
          _this.holderElement.style.width = scrollState.contentScrollWidth + "px";
        }

        if (props.translateContentSizesToHolder || props.translateContentSizeYToHolder || props.translateContentSizeXToHolder) {
          if (!scrollState.clientHeight && scrollState.contentScrollHeight || !scrollState.clientWidth && scrollState.contentScrollWidth) {
            return;
          }
        }
      } // if scrollbars visibility has changed


      if (bitmask & 1 << 10 || bitmask & 1 << 11) {
        prevScrollState.scrollYBlocked = scrollState.scrollYBlocked;
        prevScrollState.scrollXBlocked = scrollState.scrollXBlocked;
        prevScrollState.scrollYPossible = scrollState.scrollYPossible;
        prevScrollState.scrollXPossible = scrollState.scrollXPossible;

        if (_this.trackYElement && bitmask & 1 << 10) {
          _this.trackYElement.style.display = scrollState.trackYVisible ? "" : "none";
        }

        if (_this.trackXElement && bitmask & 1 << 11) {
          _this.trackXElement.style.display = scrollState.trackXVisible ? "" : "none";
        }

        _this.scrollValues = prevScrollState;

        _this.setState({
          trackYVisible: _this.scrollValues.trackYVisible = scrollState.trackYVisible,
          trackXVisible: _this.scrollValues.trackXVisible = scrollState.trackXVisible
        });

        return;
      }

      (props.native ? _this.updaterNative : _this.updaterCustom)(bitmask, scrollState);
      _this.scrollValues = scrollState;

      if (!props.native && bitmask & 1 << 15) {
        getScrollbarWidth(true);

        _this.forceUpdate();
      }

      _this.eventEmitter.emit("update", __assign({}, scrollState), prevScrollState);

      (bitmask & 1 << 4 || bitmask & 1 << 5) && _this.eventEmitter.emit("scroll", __assign({}, scrollState), prevScrollState);
      return _this.scrollValues;
    };

    _this.updaterNative = function () {
      // just for future
      return true;
    };

    _this.updaterCustom = function (bitmask, scrollValues) {
      var props = _this.props;

      if (_this.trackYElement) {
        if (_this.thumbYElement && (bitmask & 1 << 0 || bitmask & 1 << 2 || bitmask & 1 << 4 || bitmask & 1 << 6 || bitmask & 1 << 8)) {
          if (scrollValues.scrollYPossible) {
            var trackInnerSize = getInnerHeight(_this.trackYElement);
            var thumbSize = calcThumbSize(scrollValues.scrollHeight, scrollValues.clientHeight, trackInnerSize, props.minimalThumbYSize || props.minimalThumbSize, props.maximalThumbYSize || props.maximalThumbSize);
            var thumbOffset = calcThumbOffset(scrollValues.scrollHeight, scrollValues.clientHeight, trackInnerSize, thumbSize, scrollValues.scrollTop);
            _this.thumbYElement.style.transform = "translateY(" + thumbOffset + "px)";
            _this.thumbYElement.style.height = thumbSize + "px";
            _this.thumbYElement.style.display = "";
          } else {
            _this.thumbYElement.style.transform = "";
            _this.thumbYElement.style.height = "0px";
            _this.thumbYElement.style.display = "none";
          }
        }
      }

      if (_this.trackXElement) {
        if (_this.thumbXElement && (bitmask & 1 << 1 || bitmask & 1 << 3 || bitmask & 1 << 5 || bitmask & 1 << 7 || bitmask & 1 << 9 || bitmask & 1 << 12)) {
          if (scrollValues.scrollXPossible) {
            var trackInnerSize = getInnerWidth(_this.trackXElement);
            var thumbSize = calcThumbSize(scrollValues.scrollWidth, scrollValues.clientWidth, trackInnerSize, props.minimalThumbXSize || props.minimalThumbSize, props.maximalThumbXSize || props.maximalThumbSize);
            var thumbOffset = calcThumbOffset(scrollValues.scrollWidth, scrollValues.clientWidth, trackInnerSize, thumbSize, scrollValues.scrollLeft);

            if (_this.state.isRTL && shouldReverseRtlScroll()) {
              thumbOffset += trackInnerSize - thumbSize;
            }

            _this.thumbXElement.style.transform = "translateX(" + thumbOffset + "px)";
            _this.thumbXElement.style.width = thumbSize + "px";
            _this.thumbXElement.style.display = "";
          } else {
            _this.thumbXElement.style.transform = "";
            _this.thumbXElement.style.width = "0px";
            _this.thumbXElement.style.display = "none";
          }
        }
      }

      return true;
    };

    _this.elementRefHolder = function (ref) {
      _this.holderElement = ref;
      isFun(_this.props.elementRef) && _this.props.elementRef(ref);
    };

    _this.elementRefWrapper = function (ref) {
      _this.wrapperElement = ref;
      isFun(_this.props.wrapperProps.elementRef) && _this.props.wrapperProps.elementRef(ref);
    };

    _this.elementRefScroller = function (ref) {
      _this.scrollerElement = ref;
      isFun(_this.props.scrollerProps.elementRef) && _this.props.scrollerProps.elementRef(ref);
    };

    _this.elementRefContent = function (ref) {
      _this.contentElement = ref;
      isFun(_this.props.contentProps.elementRef) && _this.props.contentProps.elementRef(ref);
    };

    _this.elementRefTrackX = function (ref) {
      _this.trackXElement = ref;
      isFun(_this.props.trackXProps.elementRef) && _this.props.trackXProps.elementRef(ref);
    };

    _this.elementRefTrackY = function (ref) {
      _this.trackYElement = ref;
      isFun(_this.props.trackYProps.elementRef) && _this.props.trackYProps.elementRef(ref);
    };

    _this.elementRefThumbX = function (ref) {
      _this.thumbXElement = ref;
      isFun(_this.props.thumbXProps.elementRef) && _this.props.thumbXProps.elementRef(ref);
    };

    _this.elementRefThumbY = function (ref) {
      _this.thumbYElement = ref;
      isFun(_this.props.thumbYProps.elementRef) && _this.props.thumbYProps.elementRef(ref);
    };

    _this.handleTrackXClick = function (ev, values) {
      _this.props.trackXProps.onClick && _this.props.trackXProps.onClick(ev, values);

      if (!_this.scrollerElement || !_this.trackXElement || !_this.thumbXElement || !_this.scrollValues || !_this.scrollValues.scrollXPossible) {
        return;
      }

      _this._scrollDetection();

      var thumbSize = _this.thumbXElement.clientWidth;
      var trackInnerSize = getInnerWidth(_this.trackXElement);
      var thumbOffset = (_this.scrollValues.isRTL && shouldReverseRtlScroll() ? values.offset + thumbSize / 2 - trackInnerSize : values.offset - thumbSize / 2) - ( //@ts-ignore
      parseFloat(getComputedStyle(_this.trackXElement).paddingLeft) || 0);
      var target = calcScrollForThumbOffset(_this.scrollValues.scrollWidth, _this.scrollValues.clientWidth, trackInnerSize, thumbSize, thumbOffset);

      if (_this.props.trackClickBehavior === TRACK_CLICK_BEHAVIOR.STEP) {
        target = (_this.scrollValues.isRTL ? _this.scrollValues.scrollLeft > target : _this.scrollValues.scrollLeft < target) ? _this.scrollValues.scrollLeft + _this.scrollValues.clientWidth : _this.scrollValues.scrollLeft - _this.scrollValues.clientWidth;
      }

      _this.scrollerElement.scrollLeft = target;
    };

    _this.handleTrackYClick = function (ev, values) {
      _this.props.trackYProps.onClick && _this.props.trackYProps.onClick(ev, values);

      if (!_this.scrollerElement || !_this.trackYElement || !_this.thumbYElement || !_this.scrollValues || !_this.scrollValues.scrollYPossible) {
        return;
      }

      _this._scrollDetection();

      var thumbSize = _this.thumbYElement.clientHeight;
      var target = calcScrollForThumbOffset(_this.scrollValues.scrollHeight, _this.scrollValues.clientHeight, getInnerHeight(_this.trackYElement), thumbSize, values.offset - thumbSize / 2) - ( //@ts-ignore
      parseFloat(getComputedStyle(_this.trackYElement).paddingTop) || 0);

      if (_this.props.trackClickBehavior === TRACK_CLICK_BEHAVIOR.JUMP) {
        _this.scrollerElement.scrollTop = target;
      } else {
        _this.scrollerElement.scrollTop = _this.scrollValues.scrollTop < target ? _this.scrollValues.scrollTop + _this.scrollValues.clientHeight : _this.scrollValues.scrollTop - _this.scrollValues.clientHeight;
      }
    };

    _this.handleTrackYMouseWheel = function (ev) {
      var props = _this.props;
      props.trackYProps && props.trackYProps.onWheel && props.trackYProps.onWheel(ev);

      if (props.disableTracksMousewheelScrolling || props.disableTrackYMousewheelScrolling) {
        return;
      }

      _this._scrollDetection();

      if (!_this.scrollerElement || _this.scrollValues.scrollYBlocked) {
        return;
      }

      _this.scrollTop += ev.deltaY;
    };

    _this.handleTrackXMouseWheel = function (ev) {
      var props = _this.props;
      props.trackXProps && props.trackXProps.onWheel && props.trackXProps.onWheel(ev);

      if (props.disableTracksMousewheelScrolling || props.disableTrackXMousewheelScrolling) {
        return;
      }

      _this._scrollDetection();

      if (!_this.scrollerElement || _this.scrollValues.scrollXBlocked) {
        return;
      }

      _this.scrollLeft += ev.deltaX;
    };

    _this.handleThumbXDrag = function (data) {
      var _a;

      if (!_this.trackXElement || !_this.thumbXElement || !_this.scrollerElement || !_this.scrollValues || !_this.scrollValues.scrollXPossible) {
        return;
      }

      _this._scrollDetection();

      var trackRect = _this.trackXElement.getBoundingClientRect();

      var styles = getComputedStyle(_this.trackXElement);
      var paddingLeft = parseFloat(styles.paddingLeft) || 0;
      var paddingRight = parseFloat(styles.paddingRight) || 0;
      var trackInnerSize = trackRect.width - paddingLeft - paddingRight;
      var thumbSize = _this.thumbXElement.clientWidth;
      var offset = _this.scrollValues.isRTL && shouldReverseRtlScroll() ? data.x + thumbSize - trackInnerSize + paddingLeft : data.lastX - paddingLeft;
      _this.scrollerElement.scrollLeft = calcScrollForThumbOffset(_this.scrollValues.scrollWidth, _this.scrollValues.clientWidth, trackInnerSize, thumbSize, offset);

      if ((_a = _this.props.thumbXProps) === null || _a === void 0 ? void 0 : _a.onDrag) {
        _this.props.thumbXProps.onDrag(data);
      }
    };

    _this.handleThumbXDragEnd = function (data) {
      var _a;

      _this.handleThumbXDrag(data);

      if ((_a = _this.props.thumbXProps) === null || _a === void 0 ? void 0 : _a.onDragEnd) {
        _this.props.thumbXProps.onDragEnd(data);
      }
    };

    _this.handleThumbYDrag = function (data) {
      var _a;

      if (!_this.scrollerElement || !_this.trackYElement || !_this.thumbYElement || !_this.scrollValues || !_this.scrollValues.scrollYPossible) {
        return;
      }

      _this._scrollDetection();

      var trackRect = _this.trackYElement.getBoundingClientRect();

      var styles = getComputedStyle(_this.trackYElement);
      var paddingTop = parseFloat(styles.paddingTop) || 0;
      var paddingBottom = parseFloat(styles.paddingBottom) || 0;
      var trackInnerSize = trackRect.height - paddingTop - paddingBottom;
      var thumbSize = _this.thumbYElement.clientHeight;
      var offset = data.y - paddingTop;
      _this.scrollerElement.scrollTop = calcScrollForThumbOffset(_this.scrollValues.scrollHeight, _this.scrollValues.clientHeight, trackInnerSize, thumbSize, offset);

      if ((_a = _this.props.thumbYProps) === null || _a === void 0 ? void 0 : _a.onDrag) {
        _this.props.thumbYProps.onDrag(data);
      }
    };

    _this.handleThumbYDragEnd = function (data) {
      var _a;

      _this.handleThumbYDrag(data);

      if ((_a = _this.props.thumbYProps) === null || _a === void 0 ? void 0 : _a.onDragEnd) {
        _this.props.thumbYProps.onDragEnd(data);
      }
    };

    _this.handleScrollerScroll = function () {
      _this._scrollDetection();
    };

    _this._scrollDetection = function () {
      !_this._scrollDetectionTO && _this.eventEmitter.emit("scrollStart", _this.getScrollState());
      _this._scrollDetectionTO && global.window && global.window.clearTimeout(_this._scrollDetectionTO);
      _this._scrollDetectionTO = global.window ? global.window.setTimeout(_this._scrollDetectionCallback, _this.props.scrollDetectionThreshold || 0) : null;
    };

    _this._scrollDetectionCallback = function () {
      _this._scrollDetectionTO = null;

      _this.eventEmitter.emit("scrollStop", _this.getScrollState());
    };

    _this.state = {
      trackXVisible: false,
      trackYVisible: false,
      isRTL: props.rtl
    };
    _this.scrollValues = _this.getScrollState(true);
    _this.eventEmitter = new Emittr(15);
    props.onUpdate && _this.eventEmitter.on("update", props.onUpdate);
    props.onScroll && _this.eventEmitter.on("scroll", props.onScroll);
    props.onScrollStart && _this.eventEmitter.on("scrollStart", props.onScrollStart);
    props.onScrollStop && _this.eventEmitter.on("scrollStop", props.onScrollStop);
    _this.id = uuid();
    return _this;
  }

  Object.defineProperty(Scrollbar.prototype, "scrollTop", {
    get: function get() {
      if (this.scrollerElement) {
        return this.scrollerElement.scrollTop;
      }

      return 0;
    },
    set: function set(top) {
      if (this.scrollerElement) {
        this.scrollerElement.scrollTop = top;
        this.update();
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Scrollbar.prototype, "scrollLeft", {
    get: function get() {
      if (this.scrollerElement) {
        return this.scrollerElement.scrollLeft;
      }

      return 0;
    },
    set: function set(left) {
      if (this.scrollerElement) {
        this.scrollerElement.scrollLeft = left;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Scrollbar.prototype, "scrollHeight", {
    get: function get() {
      if (this.scrollerElement) {
        return this.scrollerElement.scrollHeight;
      }

      return 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Scrollbar.prototype, "scrollWidth", {
    get: function get() {
      if (this.scrollerElement) {
        return this.scrollerElement.scrollWidth;
      }

      return 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Scrollbar.prototype, "clientHeight", {
    get: function get() {
      if (this.scrollerElement) {
        return this.scrollerElement.clientHeight;
      }

      return 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Scrollbar.prototype, "clientWidth", {
    get: function get() {
      if (this.scrollerElement) {
        return this.scrollerElement.clientWidth;
      }

      return 0;
    },
    enumerable: false,
    configurable: true
  });

  Scrollbar.calculateStyles = function (props, state, scrollValues, scrollbarWidth) {
    var _a, _b, _c, _d;

    var useDefaultStyles = !props.noDefaultStyles;
    return {
      holder: __assign(__assign(__assign({}, useDefaultStyles && style.holder), {
        position: "relative"
      }), props.style),
      wrapper: __assign(__assign(__assign({}, useDefaultStyles && __assign(__assign(__assign({}, style.wrapper), !props.disableTracksWidthCompensation && !props.disableTrackYWidthCompensation && (_a = {}, _a[state.isRTL ? "left" : "right"] = state.trackYVisible ? 10 : 0, _a)), !props.disableTracksWidthCompensation && !props.disableTrackXWidthCompensation && {
        bottom: state.trackXVisible ? 10 : 0
      })), props.wrapperProps.style), {
        position: "absolute",
        overflow: "hidden"
      }),
      content: __assign(__assign(__assign(__assign(__assign({}, useDefaultStyles && style.content), props.translateContentSizesToHolder || props.translateContentSizeYToHolder || props.translateContentSizeXToHolder ? {
        display: "table-cell"
      } : {
        padding: 0.05
      }), useDefaultStyles && !(props.translateContentSizesToHolder || props.translateContentSizeYToHolder) && {
        minHeight: "100%"
      }), useDefaultStyles && !(props.translateContentSizesToHolder || props.translateContentSizeXToHolder) && {
        minWidth: "100%"
      }), props.contentProps.style),
      scroller: __assign(__assign(__assign(__assign((_b = {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        paddingBottom: !scrollbarWidth && scrollValues.scrollXPossible ? props.fallbackScrollbarWidth : undefined
      }, _b[state.isRTL ? "paddingLeft" : "paddingRight"] = !scrollbarWidth && scrollValues.scrollYPossible ? props.fallbackScrollbarWidth : undefined, _b), props.scrollerProps.style), !isUndef(props.rtl) && {
        direction: props.rtl ? "rtl" : "ltr"
      }), props.momentum && {
        WebkitOverflowScrolling: "touch"
      }), (_c = {
        overflowY: scrollValues.scrollYPossible ? "scroll" : "hidden",
        overflowX: scrollValues.scrollXPossible ? "scroll" : "hidden",
        marginBottom: scrollValues.scrollXPossible ? -(scrollbarWidth || props.fallbackScrollbarWidth) - Number(scrollValues.zoomLevel !== 1) : undefined
      }, _c[state.isRTL ? "marginLeft" : "marginRight"] = scrollValues.scrollYPossible ? -(scrollbarWidth || props.fallbackScrollbarWidth) - Number(scrollValues.zoomLevel !== 1) : undefined, _c)),
      trackX: __assign(__assign(__assign(__assign({}, useDefaultStyles && style.track.common), useDefaultStyles && style.track.x), props.trackXProps.style), !state.trackXVisible && {
        display: "none"
      }),
      trackY: __assign(__assign(__assign(__assign(__assign({}, useDefaultStyles && style.track.common), useDefaultStyles && style.track.y), useDefaultStyles && (_d = {}, _d[state.isRTL ? "left" : "right"] = 0, _d)), props.trackYProps.style), !state.trackYVisible && {
        display: "none"
      }),
      thumbX: __assign(__assign(__assign({}, useDefaultStyles && style.thumb.common), useDefaultStyles && style.thumb.x), props.thumbXProps.style),
      thumbY: __assign(__assign(__assign({}, useDefaultStyles && style.thumb.common), useDefaultStyles && style.thumb.y), props.thumbYProps.style)
    };
  };

  Scrollbar.prototype.componentDidMount = function () {
    if (!this.scrollerElement) {
      this.setState(function () {
        throw new Error("scroller element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function.");
      });
      return;
    }

    if (!this.contentElement) {
      this.setState(function () {
        throw new Error("content element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function.");
      });
      return;
    }

    var props = this.props;

    if (!props.native && !props.mobileNative) {
      //ToDo: move native state to the state so it can be synchronized
      if (!this.holderElement) {
        this.setState(function () {
          throw new Error("holder element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function.");
        });
        return;
      }

      if (!this.wrapperElement) {
        this.setState(function () {
          throw new Error("wrapper element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function.");
        });
        return;
      }
    }

    Loop.addTarget(this);

    if (!isUndef(props.scrollTop)) {
      this.scrollerElement.scrollTop = props.scrollTop;
    }

    if (!isUndef(props.scrollLeft)) {
      this.scrollerElement.scrollLeft = props.scrollLeft;
    }

    this.update(true);
  };

  Scrollbar.prototype.componentWillUnmount = function () {
    Loop.removeTarget(this);
  };

  Scrollbar.prototype.componentDidUpdate = function (prevProps, prevState) {
    if (!this.scrollerElement) {
      return;
    }

    var props = this.props;

    if (props.rtl !== prevProps.rtl && props.rtl !== this.state.isRTL) {
      this.setState({
        isRTL: props.rtl
      });
    }

    if (this.state.isRTL !== prevState.isRTL) {
      this.update();
    }

    if (!isUndef(props.scrollTop) && props.scrollTop !== this.scrollerElement.scrollTop) {
      this.scrollerElement.scrollTop = props.scrollTop;
    }

    if (!isUndef(props.scrollLeft) && props.scrollLeft !== this.scrollerElement.scrollLeft) {
      this.scrollerElement.scrollLeft = props.scrollLeft;
    }

    if (prevProps.onUpdate !== props.onUpdate) {
      prevProps.onUpdate && this.eventEmitter.off("update", prevProps.onUpdate);
      props.onUpdate && this.eventEmitter.on("update", props.onUpdate);
    }

    if (prevProps.onScroll !== props.onScroll) {
      prevProps.onScroll && this.eventEmitter.off("scroll", prevProps.onScroll);
      props.onScroll && this.eventEmitter.on("scroll", props.onScroll);
    }

    if (prevProps.onScrollStart !== props.onScrollStart) {
      prevProps.onScrollStart && this.eventEmitter.off("scrollStart", prevProps.onScrollStart);
      props.onScrollStart && this.eventEmitter.on("scrollStart", props.onScrollStart);
    }

    if (prevProps.onScrollStop !== props.onScrollStop) {
      prevProps.onScrollStop && this.eventEmitter.off("scrollStop", prevProps.onScrollStop);
      props.onScrollStop && this.eventEmitter.on("scrollStop", props.onScrollStop);
    }
  };

  Scrollbar.prototype.render = function () {
    var _a = this.props,
        createContext = _a.createContext,
        rtl = _a.rtl,
        native = _a.native,
        mobileNative = _a.mobileNative,
        momentum = _a.momentum;
        _a.noDefaultStyles;
        var disableTracksMousewheelScrolling = _a.disableTracksMousewheelScrolling,
        disableTrackXMousewheelScrolling = _a.disableTrackXMousewheelScrolling,
        disableTrackYMousewheelScrolling = _a.disableTrackYMousewheelScrolling;
        _a.disableTracksWidthCompensation;
        _a.disableTrackXWidthCompensation;
        _a.disableTrackYWidthCompensation;
        var noScrollX = _a.noScrollX,
        noScrollY = _a.noScrollY,
        noScroll = _a.noScroll,
        permanentTrackX = _a.permanentTrackX,
        permanentTrackY = _a.permanentTrackY,
        permanentTracks = _a.permanentTracks,
        removeTracksWhenNotUsed = _a.removeTracksWhenNotUsed,
        removeTrackYWhenNotUsed = _a.removeTrackYWhenNotUsed,
        removeTrackXWhenNotUsed = _a.removeTrackXWhenNotUsed;
        _a.minimalThumbSize;
        _a.maximalThumbSize;
        _a.minimalThumbXSize;
        _a.maximalThumbXSize;
        _a.minimalThumbYSize;
        _a.maximalThumbYSize;
        _a.fallbackScrollbarWidth;
        _a.scrollTop;
        _a.scrollLeft;
        _a.trackClickBehavior;
        _a.scrollDetectionThreshold;
        var propsWrapperProps = _a.wrapperProps,
        propsScrollerProps = _a.scrollerProps,
        propsContentProps = _a.contentProps,
        propsTrackXProps = _a.trackXProps,
        propsTrackYProps = _a.trackYProps,
        propsThumbXProps = _a.thumbXProps,
        propsThumbYProps = _a.thumbYProps,
        propsScrollbarWidth = _a.scrollbarWidth;
        _a.elementRef;
        _a.onUpdate;
        _a.onScroll;
        _a.onScrollStart;
        _a.onScrollStop;
        _a.translateContentSizesToHolder;
        _a.translateContentSizeYToHolder;
        _a.translateContentSizeXToHolder;
        var children = _a.children,
        propsHolderProps = __rest(_a, ["createContext", "rtl", "native", "mobileNative", "momentum", "noDefaultStyles", "disableTracksMousewheelScrolling", "disableTrackXMousewheelScrolling", "disableTrackYMousewheelScrolling", "disableTracksWidthCompensation", "disableTrackXWidthCompensation", "disableTrackYWidthCompensation", "noScrollX", "noScrollY", "noScroll", "permanentTrackX", "permanentTrackY", "permanentTracks", "removeTracksWhenNotUsed", "removeTrackYWhenNotUsed", "removeTrackXWhenNotUsed", "minimalThumbSize", "maximalThumbSize", "minimalThumbXSize", "maximalThumbXSize", "minimalThumbYSize", "maximalThumbYSize", "fallbackScrollbarWidth", "scrollTop", "scrollLeft", "trackClickBehavior", "scrollDetectionThreshold", "wrapperProps", "scrollerProps", "contentProps", "trackXProps", "trackYProps", "thumbXProps", "thumbYProps", "scrollbarWidth", "elementRef", "onUpdate", "onScroll", "onScrollStart", "onScrollStop", "translateContentSizesToHolder", "translateContentSizeYToHolder", "translateContentSizeXToHolder", "children"]);

    var scrollbarWidth = !isUndef(propsScrollbarWidth) ? propsScrollbarWidth : getScrollbarWidth() || 0;

    if (native || !scrollbarWidth && mobileNative) {
      this.elementRefHolder(null);
      this.elementRefWrapper(null);
      this.elementRefTrackX(null);
      this.elementRefTrackY(null);
      this.elementRefThumbX(null);
      this.elementRefThumbY(null);

      var contentProps_1 = __assign(__assign({}, propsContentProps), {
        key: "ScrollbarsCustom-Content",
        className: cnbuilder.cnb("ScrollbarsCustom-Content", propsContentProps.className),
        children: children
      });

      var scrollerProps_1 = __assign(__assign({}, propsHolderProps), {
        className: cnbuilder.cnb("ScrollbarsCustom native", this.state.trackYVisible && "trackYVisible", this.state.trackXVisible && "trackXVisible", this.state.isRTL && "rtl", propsHolderProps.className),
        style: __assign(__assign(__assign(__assign({}, propsHolderProps.style), !isUndef(rtl) && {
          direction: rtl ? "rtl" : "ltr"
        }), momentum && {
          WebkitOverflowScrolling: "touch"
        }), {
          overflowX: noScroll || noScrollX ? "hidden" : permanentTracks || permanentTrackX ? "scroll" : "auto",
          overflowY: noScroll || noScrollY ? "hidden" : permanentTracks || permanentTrackY ? "scroll" : "auto"
        }),
        onScroll: this.handleScrollerScroll,
        children: renderDivWithRenderer(contentProps_1, this.elementRefContent),
        renderer: propsScrollerProps.renderer,
        elementRef: propsScrollerProps.elementRef
      });

      return renderDivWithRenderer(scrollerProps_1, this.elementRefScroller);
    }

    var styles = Scrollbar.calculateStyles(this.props, this.state, this.scrollValues, scrollbarWidth);
    var holderChildren = [];

    var contentProps = __assign(__assign({}, propsContentProps), {
      key: "ScrollbarsCustom-Content",
      className: cnbuilder.cnb("ScrollbarsCustom-Content", propsContentProps.className),
      style: styles.content,
      children: createContext ? React__namespace.createElement(ScrollbarContext.Provider, {
        value: {
          parentScrollbar: this
        },
        children: children
      }) : children
    });

    var scrollerProps = __assign(__assign({}, propsScrollerProps), {
      key: "ScrollbarsCustom-Scroller",
      className: cnbuilder.cnb("ScrollbarsCustom-Scroller", propsScrollerProps.className),
      style: styles.scroller,
      children: renderDivWithRenderer(contentProps, this.elementRefContent),
      onScroll: this.handleScrollerScroll
    });

    var wrapperProps = __assign(__assign({}, propsWrapperProps), {
      key: "ScrollbarsCustom-Wrapper",
      className: cnbuilder.cnb("ScrollbarsCustom-Wrapper", propsWrapperProps.className),
      style: styles.wrapper,
      children: renderDivWithRenderer(scrollerProps, this.elementRefScroller)
    });

    holderChildren.push(renderDivWithRenderer(wrapperProps, this.elementRefWrapper));

    if (this.state.trackYVisible || !removeTracksWhenNotUsed && !removeTrackYWhenNotUsed) {
      var thumbYProps = __assign(__assign({}, propsThumbYProps), {
        key: "ScrollbarsCustom-ThumbY",
        style: styles.thumbY,
        elementRef: this.elementRefThumbY,
        onDrag: this.handleThumbYDrag,
        onDragEnd: this.handleThumbYDragEnd,
        axis: AXIS_DIRECTION.Y
      });

      var trackYProps = __assign(__assign(__assign(__assign({}, propsTrackYProps), {
        key: "ScrollbarsCustom-TrackY",
        style: styles.trackY,
        elementRef: this.elementRefTrackY,
        onClick: this.handleTrackYClick
      }), (disableTracksMousewheelScrolling || disableTrackYMousewheelScrolling) && {
        onWheel: this.handleTrackYMouseWheel
      }), {
        axis: AXIS_DIRECTION.Y
      });

      trackYProps.children = React__namespace.createElement(ScrollbarThumb, __assign({}, thumbYProps));
      holderChildren.push(React__namespace.createElement(ScrollbarTrack, __assign({}, trackYProps)));
    } else {
      this.elementRefTrackY(null);
      this.elementRefThumbY(null);
    }

    if (this.state.trackXVisible || !removeTracksWhenNotUsed && !removeTrackXWhenNotUsed) {
      var thumbXProps = __assign(__assign({}, propsThumbXProps), {
        key: "ScrollbarsCustom-ThumbX",
        style: styles.thumbX,
        elementRef: this.elementRefThumbX,
        onDrag: this.handleThumbXDrag,
        onDragEnd: this.handleThumbXDragEnd,
        axis: AXIS_DIRECTION.X
      });

      var trackXProps = __assign(__assign(__assign(__assign({}, propsTrackXProps), {
        key: "ScrollbarsCustom-TrackX",
        style: styles.trackX,
        elementRef: this.elementRefTrackX,
        onClick: this.handleTrackXClick
      }), (disableTracksMousewheelScrolling || disableTrackXMousewheelScrolling) && {
        onWheel: this.handleTrackXMouseWheel
      }), {
        axis: AXIS_DIRECTION.X
      });

      trackXProps.children = React__namespace.createElement(ScrollbarThumb, __assign({}, thumbXProps));
      holderChildren.push(React__namespace.createElement(ScrollbarTrack, __assign({}, trackXProps)));
    } else {
      this.elementRefTrackX(null);
      this.elementRefThumbX(null);
    }

    var holderProps = __assign(__assign({}, propsHolderProps), {
      className: cnbuilder.cnb("ScrollbarsCustom", this.state.trackYVisible && "trackYVisible", this.state.trackXVisible && "trackXVisible", this.state.isRTL && "rtl", propsHolderProps.className),
      style: styles.holder,
      children: holderChildren
    });

    return renderDivWithRenderer(holderProps, this.elementRefHolder);
  };

  Scrollbar.contextType = ScrollbarContext;
  Scrollbar.defaultProps = {
    momentum: true,
    minimalThumbSize: 30,
    fallbackScrollbarWidth: 20,
    trackClickBehavior: TRACK_CLICK_BEHAVIOR.JUMP,
    scrollDetectionThreshold: 100,
    wrapperProps: {},
    scrollerProps: {},
    contentProps: {},
    trackXProps: {},
    trackYProps: {},
    thumbXProps: {},
    thumbYProps: {}
  };
  return Scrollbar;
}(React__namespace.Component);

exports.Scrollbar = Scrollbar;
exports.ScrollbarContext = ScrollbarContext;
exports["default"] = Scrollbar;
//# sourceMappingURL=rsc.js.map
