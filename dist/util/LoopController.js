"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLoopController = createLoopController;
exports.default = exports.LoopController = void 0;

function LoopControllerClass() {
  var _this = this;

  /**
   * @typedef {Object} Scrollbar
   * @property {function} update
   */

  /**
   * @type {Scrollbar[]}
   */
  var scrollbarsRegister = [];
  /**
   * true if loop is active
   * @type {boolean}
   */

  var isActive = false;
  /**
   * ID of requested animation frame
   * @type {null|number}
   */

  var animationFrameId = null;
  /**
   * Function that called in animation frame
   */

  var animationFrameCallback = function animationFrameCallback() {
    if (!isActive) {
      return;
    }

    for (var _i = 0; _i < scrollbarsRegister.length; _i++) {
      var scrollbar = scrollbarsRegister[_i];
      scrollbar.update();
    }

    requestAnimationFrame(animationFrameCallback);
  };
  /**
   * Stop the loop if it wasn't active
   * @return {LoopControllerClass}
   */


  this.start = function () {
    if (isActive) {
      return _this;
    }

    isActive = true;
    animationFrameId && cancelAnimationFrame(animationFrameId);
    requestAnimationFrame(animationFrameCallback);
    return _this;
  };
  /**
   * Stop the loop if it is active
   * @return {LoopControllerClass}
   */


  this.stop = function () {
    if (!isActive) {
      return _this;
    }

    isActive = false;
    animationFrameId && cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    return _this;
  };
  /**
   * Return the array pf registered scrollbars
   * @return {Scrollbar[]}
   */


  this.getRegisteredScrollbars = function () {
    return scrollbarsRegister.concat();
  };
  /**
   * Add the scrollbar to list to iterate each loop
   * @param {Scrollbar} scrollbar
   * @return {LoopControllerClass}
   */


  this.registerScrollbar = function (scrollbar) {
    if (scrollbarsRegister.indexOf(scrollbar) === -1) {
      scrollbarsRegister.push(scrollbar);

      _this.start();
    }

    return _this;
  };
  /**
   * Remove the scrollbar from list to iterate each loop
   * @param {Scrollbar} scrollbar
   * @return {LoopControllerClass}
   */


  this.unregisterScrollbar = function (scrollbar) {
    var index = scrollbarsRegister.indexOf(scrollbar);

    if (index !== -1) {
      scrollbarsRegister.splice(index, 1);
    }

    return _this;
  };
}

var LoopController = new LoopControllerClass();
exports.LoopController = LoopController;
var _default = LoopController;
/**
 * Return new instance of LoopControllerClass
 * @return {LoopControllerClass}
 */

exports.default = _default;

function createLoopController() {
  return new LoopControllerClass();
}