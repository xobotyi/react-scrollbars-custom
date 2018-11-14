"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var NativeScrollbar =
/*#__PURE__*/
function (_React$Component) {
  _inherits(NativeScrollbar, _React$Component);

  function NativeScrollbar() {
    _classCallCheck(this, NativeScrollbar);

    return _possibleConstructorReturn(this, _getPrototypeOf(NativeScrollbar).apply(this, arguments));
  }

  _createClass(NativeScrollbar, [{
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props = this.props,
          rtl = _this$props.rtl,
          momentum = _this$props.momentum,
          permanentTrackX = _this$props.permanentTrackX,
          permanentTrackY = _this$props.permanentTrackY,
          permanentTracks = _this$props.permanentTracks,
          noScrollX = _this$props.noScrollX,
          noScrollY = _this$props.noScrollY,
          noScroll = _this$props.noScroll,
          tagName = _this$props.tagName,
          className = _this$props.className,
          style = _this$props.style,
          elementRef = _this$props.elementRef,
          children = _this$props.children,
          props = _objectWithoutProperties(_this$props, ["rtl", "momentum", "permanentTrackX", "permanentTrackY", "permanentTracks", "noScrollX", "noScrollY", "noScroll", "tagName", "className", "style", "elementRef", "children"]);

      var classNames = "ScrollbarsCustom native" + (rtl ? " rtl" : "") + (className ? " " + className : "");

      var styles = _objectSpread({
        position: "relative"
      }, style, rtl && {
        direction: "rtl"
      }, momentum && {
        WebkitOverflowScrolling: "touch"
      }, {
        overflowX: noScroll || noScrollX ? "hidden" : permanentTracks || permanentTrackX ? "scroll" : "auto",
        overflowY: noScroll || noScrollY ? "hidden" : permanentTracks || permanentTrackY ? "scroll" : "auto"
      });

      return _react.default.createElement(this.props.tagName, _extends({
        style: styles,
        className: classNames,
        ref: function ref(_ref) {
          _this.element = _ref;
          typeof elementRef === "function" && elementRef(_ref);
        }
      }, props), children);
    }
  }]);

  return NativeScrollbar;
}(_react.default.Component);

exports.default = NativeScrollbar;

_defineProperty(NativeScrollbar, "propTypes", {
  tagName: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  onScroll: _propTypes.default.func,
  elementRef: _propTypes.default.func
});