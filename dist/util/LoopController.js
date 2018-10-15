"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var loopIsActive = false;
var animationFrame = null;
var loopRegister = [];

var LoopController =
/*#__PURE__*/
function () {
  function LoopController() {
    _classCallCheck(this, LoopController);

    this.rafStep = this.rafStep.bind(this);
  }

  _createClass(LoopController, [{
    key: "getRegisteredItems",
    value: function getRegisteredItems() {
      return loopRegister.concat();
    }
  }, {
    key: "registerScrollbar",
    value: function registerScrollbar(scrollbar) {
      if (!loopRegister.includes(scrollbar)) {
        loopRegister.push(scrollbar);
        this.start();
      }

      return this;
    }
  }, {
    key: "unregisterScrollbar",
    value: function unregisterScrollbar(scrollbar) {
      var index = loopRegister.indexOf(scrollbar);

      if (index !== -1) {
        loopRegister.length === 1 && this.stop();
        loopRegister.splice(index, 1);
      }

      return this;
    }
  }, {
    key: "start",
    value: function start() {
      if (!loopIsActive) {
        loopIsActive = true;
        animationFrame && cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(this.rafStep);
      }

      return this;
    }
  }, {
    key: "rafStep",
    value: function rafStep() {
      if (!loopIsActive) {
        return;
      }

      for (var i = 0; i < loopRegister.length; i++) {
        loopRegister[i].update();
      }

      animationFrame = requestAnimationFrame(this.rafStep);
    }
  }, {
    key: "stop",
    value: function stop() {
      if (loopIsActive) {
        loopIsActive = false;
        animationFrame && cancelAnimationFrame(animationFrame);
      }

      return this;
    }
  }]);

  return LoopController;
}();

var instance = new LoopController();
var _default = instance;
exports.default = _default;