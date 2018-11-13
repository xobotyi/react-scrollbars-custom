"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TYPE_Y = exports.TYPE_X = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TYPE_X = 1;
exports.TYPE_X = TYPE_X;
var TYPE_Y = 2;
exports.TYPE_Y = TYPE_Y;

var Track =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Track, _React$Component);

  function Track(props) {
    var _this;

    _classCallCheck(this, Track);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Track).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onClickHandler", function (ev) {
      if (ev.target !== _this.element || !_this.props.onClick) {
        return true;
      }

      var rect = _this.element.getBoundingClientRect();

      _this.props.onClick(ev, {
        axis: _this.props.type,
        offset: _this.props.type === TYPE_X ? ev.clientX - rect.left : ev.clientY - rect.top
      });
    });

    return _this;
  }

  _createClass(Track, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          className = _this$props.className,
          renderer = _this$props.renderer,
          type = _this$props.type,
          elementRef = _this$props.elementRef,
          onClick = _this$props.onClick,
          props = _objectWithoutProperties(_this$props, ["className", "renderer", "type", "elementRef", "onClick"]);

      props.className = "track " + (type === TYPE_X ? "trackX" : "trackY") + (className ? " " + className : "");
      props.onClick = this.onClickHandler;
      return renderer ? renderer(props) : _react.default.createElement("div", _extends({}, props, {
        ref: function ref(_ref) {
          typeof elementRef === "function" && elementRef(_ref);
          _this2.element = _ref;
        }
      }));
    }
  }]);

  return Track;
}(_react.default.Component);

exports.default = Track;

_defineProperty(Track, "displayName", "Scrollbar Track");

_defineProperty(Track, "propTypes", {
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  type: _propTypes.default.oneOf([TYPE_X, TYPE_Y]).isRequired,
  elementRef: _propTypes.default.func,
  renderer: _propTypes.default.func
});