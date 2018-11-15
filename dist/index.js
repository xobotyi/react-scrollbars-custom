"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _NativeScrollbar = _interopRequireDefault(require("./NativeScrollbar"));

var _Thumb = _interopRequireDefault(require("./Thumb"));

var _Track = _interopRequireWildcard(require("./Track"));

var _getInnerSizes = require("./util/getInnerSizes");

var _getScrollbarWidth = _interopRequireDefault(require("./util/getScrollbarWidth"));

var _LoopController = _interopRequireDefault(require("./util/LoopController"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultStyles = {
  holder: {
    position: "relative",
    display: "flex"
  },
  wrapper: {
    flexGrow: 1
  },
  content: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
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
      height: 8,
      width: "calc(100% - 16px)",
      bottom: 0,
      left: 8
    },
    y: {
      width: 8,
      height: "calc(100% - 16px)",
      top: 8
    }
  },
  thumb: {
    common: {
      cursor: "pointer",
      borderRadius: 4,
      background: "rgba(0,0,0,.4)"
    },
    x: {
      height: "100%"
    },
    y: {
      width: "100%"
    }
  }
};
/**
 * @typedef {object} ScrollValues
 *
 * @property {number|null} clientHeight - content's native clientHeight parameter
 * @property {number|null} clientWidth - content's native clientWidth parameter
 * @property {number|null} scrollHeight - content's native scrollHeight parameter
 * @property {number|null} scrollWidth - content's native scrollWidth parameter
 * @property {number|null} scrollTop - content's native scrollTop parameter
 * @property {number|null} scrollLeft - content's native scrollLeft parameter
 * @property {boolean|null} scrollYBlocked - Indicates whether vertical scroll blocked via properties
 * @property {boolean|null} scrollXBlocked - Indicates whether horizontal scroll blocked via properties
 * @property {boolean|null} scrollYPossible - Indicates whether the content overflows vertically and scrolling not blocked
 * @property {boolean|null} scrollXPossible - Indicates whether the content overflows horizontally and scrolling not blocked
 * @property {boolean|null} trackYVisible - Indicates whether vertical track is visible
 * @property {boolean|null} trackXVisible - Indicates whether horizontal track is visible
 * @property {boolean|null} isRtl - Indicates whether display direction is right-to-left
 */

var Scrollbar =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Scrollbar, _React$Component);

  _createClass(Scrollbar, null, [{
    key: "computeThumbSize",

    /**
     * Compute the thumb size
     *
     * @param {number} trackSize
     * @param {number} scrollableSize
     * @param {number} viewportSize
     * @param {number} minimalSize
     * @return {number}
     */
    value: function computeThumbSize(trackSize, scrollableSize, viewportSize, minimalSize) {
      var size = Math.ceil(viewportSize / scrollableSize * trackSize) || 0;
      return trackSize === size ? 0 : Math.max(size, minimalSize);
    }
    /**
     * Compute the thumb offset from scroll value
     *
     * @param {number} trackSize
     * @param {number} thumbSize
     * @param {number} scrollableSize
     * @param {number} viewportSize
     * @param {number} scrollValue
     * @return {number}
     */

  }, {
    key: "computeThumbOffset",
    value: function computeThumbOffset(trackSize, thumbSize, scrollableSize, viewportSize, scrollValue) {
      return thumbSize && scrollValue / (scrollableSize - viewportSize) * (trackSize - thumbSize) || 0;
    }
    /**
     * Compute the scroll value depending on thumb offset
     *
     * @param {number} trackSize
     * @param {number} thumbSize
     * @param {number} offset
     * @param {number} scrollableSize
     * @param {number} viewportSize
     * @return {number}
     */

  }, {
    key: "computeScrollForOffset",
    value: function computeScrollForOffset(trackSize, thumbSize, offset, scrollableSize, viewportSize) {
      return (offset - thumbSize / 2) / (trackSize - thumbSize) * (scrollableSize - viewportSize) || 0;
    }
  }]);

  function Scrollbar(props) {
    var _this;

    _classCallCheck(this, Scrollbar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Scrollbar).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleScrollEvent", function () {
      _this.scrollDetect();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "scrollDetect", function () {
      if (!_this.props.onScrollStart && !_this.props.onScrollStop) {
        return;
      }

      !_this.scrollDetect.timeout && _this.props.onScrollStart && _this.props.onScrollStart.call(_assertThisInitialized(_assertThisInitialized(_this)), _this.getScrollValues());
      _this.scrollDetect.timeout && clearTimeout(_this.scrollDetect.timeout);
      _this.scrollDetect.timeout = setTimeout(function () {
        _this.scrollDetect.timeout = null;
        _this.props.onScrollStop && _this.props.onScrollStop.call(_assertThisInitialized(_assertThisInitialized(_this)), _this.getScrollValues());
      }, _this.props.scrollDetectionThreshold);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "update", function () {
      var forced = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      // autodetect direction if not defined
      if (typeof _this.state.isRtl !== "boolean") {
        _this.setState({
          isRtl: getComputedStyle(_this.contentEl).direction === "rtl"
        });

        return _this.getScrollValues();
      }

      var scrollValues = _this.getScrollValues(true),
          prevScrollValues = _this.getScrollValues();

      var bitmask = 0; // calculating bitmask

      prevScrollValues.clientHeight !== scrollValues.clientHeight && (bitmask |= 1 << 0);
      prevScrollValues.clientWidth !== scrollValues.clientWidth && (bitmask |= 1 << 1);
      prevScrollValues.scrollHeight !== scrollValues.scrollHeight && (bitmask |= 1 << 2);
      prevScrollValues.scrollWidth !== scrollValues.scrollWidth && (bitmask |= 1 << 3);
      prevScrollValues.scrollTop !== scrollValues.scrollTop && (bitmask |= 1 << 4);
      prevScrollValues.scrollLeft !== scrollValues.scrollLeft && (bitmask |= 1 << 5);
      prevScrollValues.scrollYBlocked !== scrollValues.scrollYBlocked && (bitmask |= 1 << 6);
      prevScrollValues.scrollXBlocked !== scrollValues.scrollXBlocked && (bitmask |= 1 << 7);
      prevScrollValues.scrollYPossible !== scrollValues.scrollYPossible && (bitmask |= 1 << 8);
      prevScrollValues.scrollXPossible !== scrollValues.scrollXPossible && (bitmask |= 1 << 9);
      prevScrollValues.trackYVisible !== scrollValues.trackYVisible && (bitmask |= 1 << 10);
      prevScrollValues.trackXVisible !== scrollValues.trackXVisible && (bitmask |= 1 << 11);
      prevScrollValues.isRtl !== scrollValues.isRtl && (bitmask |= 1 << 12); // if not forced and nothing has changed - skip this step

      if (bitmask === 0 && !forced) {
        return prevScrollValues;
      } // if updater return true - call callbacks and cache the scroll values


      if ((_this.props.native ? _this.updaterNative : _this.updaterCustom).call(_assertThisInitialized(_assertThisInitialized(_this)), scrollValues, prevScrollValues, bitmask)) {
        _this.scrollValues = scrollValues;
        prevScrollValues.scrollTop !== null && _this.props.onScroll && _this.props.onScroll(scrollValues, prevScrollValues);
      }

      return prevScrollValues;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleTrackClick", function (e, params) {
      params.axis === _Track.TYPE_X && _this.props.trackXProps.onClick && _this.props.trackXProps.onClick(e, params);
      params.axis === _Track.TYPE_Y && _this.props.trackYProps.onClick && _this.props.trackYProps.onClick(e, params);
      var scrollTarget = params.axis === _Track.TYPE_X ? Scrollbar.computeScrollForOffset((0, _getInnerSizes.getInnerWidth)(_this.trackXEl), _this.thumbXEl.clientWidth, params.offset, _this.contentEl.scrollWidth, _this.contentEl.clientWidth) : Scrollbar.computeScrollForOffset((0, _getInnerSizes.getInnerHeight)(_this.trackYEl), _this.thumbYEl.clientHeight, params.offset, _this.contentEl.scrollHeight, _this.contentEl.clientHeight);

      if (_this.props.trackClickBehavior === "jump") {
        params.axis === _Track.TYPE_X && (_this.contentEl.scrollLeft = scrollTarget);
        params.axis === _Track.TYPE_Y && (_this.contentEl.scrollTop = scrollTarget);
      } else if (_this.props.trackClickBehavior === "step") {
        params.axis === _Track.TYPE_X && (_this.contentEl.scrollLeft = _this.contentEl.scrollLeft < scrollTarget ? _this.contentEl.scrollLeft + _this.contentEl.clientWidth : _this.contentEl.scrollLeft - _this.contentEl.clientWidth);
        params.axis === _Track.TYPE_Y && (_this.contentEl.scrollTop = _this.contentEl.scrollTop < scrollTarget ? _this.contentEl.scrollTop + _this.contentEl.clientHeight : _this.contentEl.scrollTop - _this.contentEl.clientHeight);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleThumbDragStart", function (params) {
      params.axis === _Track.TYPE_X && _this.props.thumbXProps.onDragStart && _this.props.thumbXProps.onDragStart(params);
      params.axis === _Track.TYPE_Y && _this.props.thumbYProps.onDragStart && _this.props.thumbYProps.onDragStart(params);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleThumbDragEnd", function (params) {
      params.axis === _Track.TYPE_X && _this.props.thumbXProps.onDragEnd && _this.props.thumbXProps.onDragEnd(params);
      params.axis === _Track.TYPE_Y && _this.props.thumbYProps.onDragEnd && _this.props.thumbYProps.onDragEnd(params);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleThumbDrag", function (params) {
      _this.scrollDetect();

      if (params.axis === _Track.TYPE_X) {
        _this.props.thumbXProps.onDrag && _this.props.thumbXProps.onDrag(params);
        _this.contentEl.scrollLeft = Scrollbar.computeScrollForOffset((0, _getInnerSizes.getInnerWidth)(_this.trackXEl), _this.thumbXEl.clientWidth, params.offset, _this.contentEl.scrollWidth, _this.contentEl.clientWidth);
      }

      if (params.axis === _Track.TYPE_Y) {
        _this.props.thumbYProps.onDrag && _this.props.thumbYProps.onDrag(params);
        _this.contentEl.scrollTop = Scrollbar.computeScrollForOffset((0, _getInnerSizes.getInnerHeight)(_this.trackYEl), _this.thumbYEl.clientHeight, params.offset, _this.contentEl.scrollHeight, _this.contentEl.clientHeight);
      }
    });

    _this.state = {
      trackYVisible: true,
      trackXVisible: true,
      isRtl: _this.props.rtl
    };
    _this.scrollValues = _this.getScrollValues(true);
    return _this;
  }

  _createClass(Scrollbar, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.rtl !== prevProps.rtl && this.props.rtl !== this.state.isRtl) {
        this.setState({
          isRtl: this.props.rtl
        });
      }

      if (this.state.isRtl !== prevState.isRtl) {
        this.update();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      _LoopController.default.registerScrollbar(this);

      this.contentEl.addEventListener("scroll", this.handleScrollEvent, {
        passive: true
      });
      this.update();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _LoopController.default.unregisterScrollbar(this);

      this.contentEl.removeEventListener("scroll", this.handleScrollEvent, {
        passive: true
      });
    }
  }, {
    key: "scrollToTop",

    /**
     * Scrol to the top border
     *
     * @return {Scrollbar}
     */
    value: function scrollToTop() {
      if (this.contentEl) {
        this.contentEl.scrollTop = 0;
      }

      return this;
    }
    /**
     * Scroll to the bottom border
     *
     * @return {Scrollbar}
     */

  }, {
    key: "scrollToBottom",
    value: function scrollToBottom() {
      if (this.contentEl) {
        this.contentEl.scrollTop = this.contentEl.scrollHeight;
      }

      return this;
    }
    /**
     * Scrolls to the left border
     *
     * @return {Scrollbar}
     */

  }, {
    key: "scrollToLeft",
    value: function scrollToLeft() {
      if (this.contentEl) {
        this.contentEl.scrollLeft = 0;
      }

      return this;
    }
    /**
     * Scroll to the right border
     *
     * @return {Scrollbar}
     */

  }, {
    key: "scrollToRight",
    value: function scrollToRight() {
      if (this.contentEl) {
        this.contentEl.scrollLeft = this.contentEl.scrollWidth;
      }

      return this;
    }
    /**
     * @param {boolean} force
     *
     * @return {ScrollValues}
     */

  }, {
    key: "getScrollValues",
    value: function getScrollValues() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!force) {
        return this.scrollValues;
      }

      var scrollValues = {
        clientHeight: null,
        clientWidth: null,
        scrollHeight: null,
        scrollWidth: null,
        scrollTop: null,
        scrollLeft: null,
        scrollYBlocked: null,
        scrollXBlocked: null,
        scrollYPossible: null,
        scrollXPossible: null,
        trackYVisible: null,
        trackXVisible: null,
        isRtl: null
      };

      if (this.contentEl) {
        scrollValues.clientHeight = this.contentEl.clientHeight;
        scrollValues.clientWidth = this.contentEl.clientWidth;
        scrollValues.scrollHeight = this.contentEl.scrollHeight;
        scrollValues.scrollWidth = this.contentEl.scrollWidth;
        scrollValues.scrollTop = this.contentEl.scrollTop;
        scrollValues.scrollLeft = this.contentEl.scrollLeft;
        scrollValues.scrollYBlocked = this.props.noScroll || this.props.noScrollY;
        scrollValues.scrollXBlocked = this.props.noScroll || this.props.noScrollX;
        scrollValues.scrollYPossible = !scrollValues.scrollYBlocked && scrollValues.scrollHeight > scrollValues.clientHeight;
        scrollValues.scrollXPossible = !scrollValues.scrollXBlocked && scrollValues.scrollWidth > scrollValues.clientWidth;
        scrollValues.trackYVisible = scrollValues.scrollYPossible || this.props.permanentTracks || this.props.permanentTrackY;
        scrollValues.trackXVisible = scrollValues.scrollXPossible || this.props.permanentTracks || this.props.permanentTrackX;
        scrollValues.isRtl = this.state.isRtl;
      }

      return scrollValues;
    }
    /**
     *
     * @param forced
     * @return {ScrollValues}
     */

  }, {
    key: "updaterCustom",

    /**
     * @param {ScrollValues} scrollValues current scroll values
     * @param {ScrollValues} prevScrollValues scroll values that been before the update process
     * @param {number} bitmask bit mask that represents difference between prev scroll values and current ones
     *
     * @return {boolean} whether to save current scroll values or not
     */
    value: function updaterCustom(scrollValues, prevScrollValues, bitmask) {
      // if scrollbars visibility has changed
      if (bitmask & 1 << 10 || bitmask & 1 << 11) {
        this.scrollValues.scrollYBlocked = scrollValues.scrollYBlocked;
        this.scrollValues.scrollXBlocked = scrollValues.scrollXBlocked;
        this.scrollValues.scrollYPossible = scrollValues.scrollYPossible;
        this.scrollValues.scrollXPossible = scrollValues.scrollXPossible;
        this.setState({
          trackYVisible: this.scrollValues.trackYVisible = scrollValues.trackYVisible,
          trackXVisible: this.scrollValues.trackXVisible = scrollValues.trackXVisible
        });
        return false;
      } // if Y track rendered and changed anything related to scrollY


      if (this.trackYEl) {
        bitmask & 1 << 10 && (this.trackYEl.style.display = scrollValues.trackYVisible ? null : "none");

        if (bitmask & 1 << 0 || bitmask & 1 << 2 || bitmask & 1 << 4 || bitmask & 1 << 6 || bitmask & 1 << 8) {
          if (scrollValues.scrollYPossible) {
            var trackSize = (0, _getInnerSizes.getInnerHeight)(this.trackYEl);
            var thumbSize = Scrollbar.computeThumbSize(trackSize, scrollValues.scrollHeight, scrollValues.clientHeight, this.props.minimalThumbsSize);
            var thumbOffset = Scrollbar.computeThumbOffset(trackSize, thumbSize, scrollValues.scrollHeight, scrollValues.clientHeight, scrollValues.scrollTop);
            this.thumbYEl.style.transform = "translateY(".concat(thumbOffset, "px)");
            this.thumbYEl.style.height = thumbSize + "px";
            this.thumbYEl.style.display = null;
          } else {
            this.thumbYEl.style.transform = null;
            this.thumbYEl.style.height = "0px";
            this.thumbYEl.style.display = "none";
          }
        }
      } // if X track rendered and changed anything related to scrollX


      if (this.trackXEl) {
        bitmask & 1 << 11 && (this.trackXEl.style.display = scrollValues.trackXVisible ? null : "none");

        if (bitmask & 1 << 1 || bitmask & 1 << 3 || bitmask & 1 << 5 || bitmask & 1 << 7 || bitmask & 1 << 9) {
          if (scrollValues.scrollXPossible) {
            var _trackSize = (0, _getInnerSizes.getInnerWidth)(this.trackXEl);

            var _thumbSize = Scrollbar.computeThumbSize(_trackSize, scrollValues.scrollWidth, scrollValues.clientWidth, this.props.minimalThumbsSize);

            var _thumbOffset = Scrollbar.computeThumbOffset(_trackSize, _thumbSize, scrollValues.scrollWidth, scrollValues.clientWidth, scrollValues.scrollLeft);

            if (this.state.isRtl) {
              _thumbOffset = _thumbSize + _thumbOffset - _trackSize;
            }

            this.thumbXEl.style.transform = "translateX(".concat(_thumbOffset, "px)");
            this.thumbXEl.style.width = _thumbSize + "px";
            this.thumbXEl.style.display = null;
          } else {
            this.thumbXEl.style.transform = null;
            this.thumbXEl.style.width = "0px";
            this.thumbXEl.style.display = "none";
          }
        }
      }

      if (this.props.translateContentSizesToHolder && this.holderEl && (bitmask & 1 << 2 || bitmask & 1 << 3)) {
        this.holderEl.style.width = scrollValues.scrollWidth + "px";
        this.holderEl.style.height = scrollValues.scrollHeight + "px";
      }

      return true;
    }
    /**
     * @param {ScrollValues} scrollValues current scroll values
     * @param {ScrollValues} prevScrollValues scroll values that been before the update process
     *
     * @param {number} bitmask bit mask that represents difference between prev scroll values and current ones
     */

  }, {
    key: "updaterNative",
    value: function updaterNative(scrollValues, prevScrollValues, bitmask) {
      return true;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          native = _this$props.native,
          minimalThumbsSize = _this$props.minimalThumbsSize,
          fallbackScrollbarWidth = _this$props.fallbackScrollbarWidth,
          scrollDetectionThreshold = _this$props.scrollDetectionThreshold,
          tagName = _this$props.tagName,
          className = _this$props.className,
          style = _this$props.style,
          trackClickBehavior = _this$props.trackClickBehavior,
          rtl = _this$props.rtl,
          momentum = _this$props.momentum,
          noDefaultStyles = _this$props.noDefaultStyles,
          translateContentSizesToHolder = _this$props.translateContentSizesToHolder,
          noScrollX = _this$props.noScrollX,
          noScrollY = _this$props.noScrollY,
          noScroll = _this$props.noScroll,
          permanentTrackX = _this$props.permanentTrackX,
          permanentTrackY = _this$props.permanentTrackY,
          permanentTracks = _this$props.permanentTracks,
          removeTracksWhenNotUsed = _this$props.removeTracksWhenNotUsed,
          removeTrackYWhenNotUsed = _this$props.removeTrackYWhenNotUsed,
          removeTrackXWhenNotUsed = _this$props.removeTrackXWhenNotUsed,
          propsWrapperProps = _this$props.wrapperProps,
          propsContentProps = _this$props.contentProps,
          propsTrackXProps = _this$props.trackXProps,
          propsTrackYProps = _this$props.trackYProps,
          propsThumbXProps = _this$props.thumbXProps,
          propsThumbYProps = _this$props.thumbYProps,
          wrapperRenderer = _this$props.wrapperRenderer,
          contentRenderer = _this$props.contentRenderer,
          trackXRenderer = _this$props.trackXRenderer,
          trackYRenderer = _this$props.trackYRenderer,
          thumbXRenderer = _this$props.thumbXRenderer,
          thumbYRenderer = _this$props.thumbYRenderer,
          onScroll = _this$props.onScroll,
          onScrollStart = _this$props.onScrollStart,
          onScrollStop = _this$props.onScrollStop,
          children = _this$props.children,
          props = _objectWithoutProperties(_this$props, ["native", "minimalThumbsSize", "fallbackScrollbarWidth", "scrollDetectionThreshold", "tagName", "className", "style", "trackClickBehavior", "rtl", "momentum", "noDefaultStyles", "translateContentSizesToHolder", "noScrollX", "noScrollY", "noScroll", "permanentTrackX", "permanentTrackY", "permanentTracks", "removeTracksWhenNotUsed", "removeTrackYWhenNotUsed", "removeTrackXWhenNotUsed", "wrapperProps", "contentProps", "trackXProps", "trackYProps", "thumbXProps", "thumbYProps", "wrapperRenderer", "contentRenderer", "trackXRenderer", "trackYRenderer", "thumbXRenderer", "thumbYRenderer", "onScroll", "onScrollStart", "onScrollStop", "children"]);

      var _this$state = this.state,
          trackXVisible = _this$state.trackXVisible,
          trackYVisible = _this$state.trackYVisible;
      var scrollValues = this.getScrollValues();

      if (native) {
        return _react.default.createElement(_NativeScrollbar.default, _extends({
          rtl: rtl,
          momentum: momentum,
          permanentTrackX: permanentTrackX,
          permanentTrackY: permanentTrackY,
          permanentTracks: permanentTracks,
          noScrollX: noScrollX,
          noScrollY: noScrollY,
          noScroll: noScroll,
          tagName: tagName,
          className: (trackYVisible ? " trackYVisible" : "") + (trackYVisible ? " trackXVisible" : "") + (className ? " " + className : ""),
          style: style,
          elementRef: function elementRef(ref) {
            return _this2.contentEl = ref;
          },
          onScroll: this.handleScrollEvent,
          children: children
        }, props));
      }

      var browserSBW = (0, _getScrollbarWidth.default)();
      var scrollbarWidth = browserSBW || fallbackScrollbarWidth;

      var wrapperProps = _objectSpread({}, propsWrapperProps),
          contentProps = _objectSpread({}, propsContentProps),
          trackXProps = _objectSpread({}, propsTrackXProps),
          trackYProps = _objectSpread({}, propsTrackYProps),
          thumbXProps = _objectSpread({}, propsThumbXProps),
          thumbYProps = _objectSpread({}, propsThumbYProps);

      wrapperProps.key = "wrapper";
      contentProps.key = "content";
      trackXProps.key = "trackX";
      trackYProps.key = "trackY";
      thumbXProps.key = "thumbX";
      thumbYProps.key = "thumbY";

      if (!noDefaultStyles) {
        var _objectSpread2;

        props.style = _objectSpread({}, defaultStyles.holder);
        wrapperProps.style = _objectSpread({}, defaultStyles.wrapper, (_objectSpread2 = {}, _defineProperty(_objectSpread2, this.state.isRtl ? "marginLeft" : "marginRight", trackYVisible ? 8 : null), _defineProperty(_objectSpread2, "marginBottom", trackXVisible ? 8 : null), _objectSpread2));
        trackXProps.style = _objectSpread({}, defaultStyles.track.common, defaultStyles.track.x);
        trackYProps.style = _objectSpread({}, defaultStyles.track.common, defaultStyles.track.y, _defineProperty({}, this.state.isRtl ? "left" : "right", 0));
        thumbXProps.style = _objectSpread({}, defaultStyles.thumb.common, defaultStyles.thumb.x);
        thumbYProps.style = _objectSpread({}, defaultStyles.thumb.common, defaultStyles.thumb.y);
      }

      props.style = _objectSpread({}, props.style, style, typeof rtl !== "undefined" && {
        direction: rtl ? "rtl" : "ltr"
      });
      wrapperProps.style = _objectSpread({}, wrapperProps.style, propsWrapperProps.style, {
        position: "relative",
        overflow: "hidden"
      });
      contentProps.style = _objectSpread({}, defaultStyles.content, propsContentProps.style, momentum && {
        WebkitOverflowScrolling: "touch"
      }, {
        overflowY: scrollValues.scrollYPossible ? "scroll" : "hidden",
        overflowX: scrollValues.scrollXPossible ? "scroll" : "hidden"
      }, this.state.isRtl ? {
        paddingLeft: !browserSBW && scrollValues.scrollYPossible ? scrollbarWidth : null,
        marginLeft: scrollValues.scrollYPossible ? -scrollbarWidth : null
      } : {
        paddingRight: !browserSBW && scrollValues.scrollYPossible ? scrollbarWidth : null,
        marginRight: scrollValues.scrollYPossible ? -scrollbarWidth : null
      }, {
        paddingBottom: !browserSBW && scrollValues.scrollXPossible ? scrollbarWidth : null,
        marginBottom: scrollValues.scrollXPossible ? -scrollbarWidth : null
      });
      trackXProps.style = _objectSpread({}, trackXProps.style, propsTrackXProps.style, !trackXVisible && {
        display: "none"
      });
      trackYProps.style = _objectSpread({}, trackYProps.style, propsTrackYProps.style, !trackYVisible && {
        display: "none"
      });
      thumbXProps.style = _objectSpread({}, thumbXProps.style, propsThumbXProps.style);
      thumbYProps.style = _objectSpread({}, thumbYProps.style, propsThumbYProps.style);
      props.className = "ScrollbarsCustom" + (trackYVisible ? " trackYVisible" : "") + (trackYVisible ? " trackXVisible" : "") + (this.state.isRtl ? " rtl" : "") + (className ? " " + className : "");
      contentProps.className = "content" + (contentProps.className ? " " + contentProps.className : "");
      wrapperProps.className = "wrapper" + (wrapperProps.className ? " " + wrapperProps.className : "");

      props.ref = function (ref) {
        _this2.holderEl = ref;
      };

      wrapperProps[wrapperRenderer ? "elementRef" : "ref"] = function (ref) {
        _this2.wrapperEl = ref;
      };

      contentProps[contentRenderer ? "elementRef" : "ref"] = function (ref) {
        _this2.contentEl = ref;
      };

      trackXProps.elementRef = function (ref) {
        _this2.trackXEl = ref;
      };

      trackYProps.elementRef = function (ref) {
        _this2.trackYEl = ref;
      };

      thumbXProps.elementRef = function (ref) {
        _this2.thumbXEl = ref;
      };

      thumbYProps.elementRef = function (ref) {
        _this2.thumbYEl = ref;
      };

      trackXProps.renderer = trackXRenderer;
      trackYProps.renderer = trackYRenderer;
      thumbXProps.renderer = thumbXRenderer;
      thumbYProps.renderer = thumbYRenderer;
      trackYProps.onClick = trackXProps.onClick = this.handleTrackClick;
      thumbYProps.onDragStart = thumbXProps.onDragStart = this.handleThumbDragStart;
      thumbYProps.onDragEnd = thumbXProps.onDragEnd = this.handleThumbDragEnd;
      thumbYProps.onDrag = thumbXProps.onDrag = this.handleThumbDrag;
      contentProps.children = children;
      wrapperProps.children = contentRenderer ? contentRenderer(contentProps) : _react.default.createElement("div", contentProps);
      return _react.default.createElement(this.props.tagName, props, wrapperRenderer ? wrapperRenderer(wrapperProps) : _react.default.createElement("div", wrapperProps), (trackYVisible || !(removeTracksWhenNotUsed && removeTrackYWhenNotUsed)) && _react.default.createElement(_Track.default, _extends({
        type: _Track.TYPE_Y
      }, trackYProps), _react.default.createElement(_Thumb.default, _extends({
        type: _Track.TYPE_Y
      }, thumbYProps))), (trackXVisible || !(removeTracksWhenNotUsed && removeTrackXWhenNotUsed)) && _react.default.createElement(_Track.default, _extends({
        type: _Track.TYPE_X
      }, trackXProps), _react.default.createElement(_Thumb.default, _extends({
        type: _Track.TYPE_X
      }, thumbXProps))));
    }
  }, {
    key: "scrollTop",

    /**
     * Return the vertical scroll position
     *
     * @return {number}
     */
    get: function get() {
      if (this.contentEl) {
        return this.contentEl.scrollTop;
      }

      return 0;
    }
    /**
     *
     * Set the vertical scroll to given amount of pixels
     *
     * @param top {number} Pixels amount
     */
    ,
    set: function set(top) {
      if (this.contentEl) {
        this.contentEl.scrollTop = top;
        this.update();
      }
    }
    /**
     * Return the horizontal scroll position
     *
     * @return {number}
     */

  }, {
    key: "scrollLeft",
    get: function get() {
      if (this.contentEl) {
        return this.contentEl.scrollLeft;
      }

      return 0;
    }
    /**
     * Set the horizontal scroll to given amount of pixels
     *
     * @param left {number} Pixels amount
     */
    ,
    set: function set(left) {
      if (this.contentEl) {
        this.contentEl.scrollLeft = left;
      }
    }
    /**
     * @return {number}
     */

  }, {
    key: "scrollHeight",
    get: function get() {
      if (this.contentEl) {
        return this.contentEl.scrollHeight;
      }

      return 0;
    }
    /**
     * @return {number}
     */

  }, {
    key: "scrollWidth",
    get: function get() {
      if (this.contentEl) {
        return this.contentEl.scrollWidth;
      }

      return 0;
    }
    /**
     * @return {number}
     */

  }, {
    key: "clientHeight",
    get: function get() {
      if (this.contentEl) {
        return this.contentEl.clientHeight;
      }

      return 0;
    }
    /**
     * @return {number}
     */

  }, {
    key: "clientWidth",
    get: function get() {
      if (this.contentEl) {
        return this.contentEl.clientWidth;
      }

      return 0;
    }
  }]);

  return Scrollbar;
}(_react.default.Component);

exports.default = Scrollbar;

_defineProperty(Scrollbar, "propTypes", {
  native: _propTypes.default.bool,
  minimalThumbsSize: _propTypes.default.number,
  fallbackScrollbarWidth: _propTypes.default.number,
  tagName: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  trackClickBehavior: _propTypes.default.oneOf(["jump", "step"]),
  rtl: _propTypes.default.bool,
  momentum: _propTypes.default.bool,
  noDefaultStyles: _propTypes.default.bool,
  scrollDetectionThreshold: _propTypes.default.number,
  translateContentSizesToHolder: _propTypes.default.bool,
  noScrollX: _propTypes.default.bool,
  noScrollY: _propTypes.default.bool,
  noScroll: _propTypes.default.bool,
  removeTracksWhenNotUsed: _propTypes.default.bool,
  removeTrackYWhenNotUsed: _propTypes.default.bool,
  removeTrackXWhenNotUsed: _propTypes.default.bool,
  permanentTrackX: _propTypes.default.bool,
  permanentTrackY: _propTypes.default.bool,
  permanentTracks: _propTypes.default.bool,
  wrapperProps: _propTypes.default.object,
  contentProps: _propTypes.default.object,
  trackXProps: _propTypes.default.object,
  trackYProps: _propTypes.default.object,
  thumbXProps: _propTypes.default.object,
  thumbYProps: _propTypes.default.object,
  wrapperRenderer: _propTypes.default.func,
  contentRenderer: _propTypes.default.func,
  trackXRenderer: _propTypes.default.func,
  trackYRenderer: _propTypes.default.func,
  thumbXRenderer: _propTypes.default.func,
  thumbYRenderer: _propTypes.default.func,
  onScroll: _propTypes.default.func,
  onScrollStart: _propTypes.default.func,
  onScrollStop: _propTypes.default.func
});

_defineProperty(Scrollbar, "defaultProps", {
  native: false,
  tagName: "div",
  minimalThumbsSize: 30,
  fallbackScrollbarWidth: 20,
  trackClickBehavior: "jump",
  momentum: true,
  noDefaultStyles: false,
  scrollDetectionThreshold: 100,
  translateContentSizesToHolder: false,
  noScrollX: false,
  noScrollY: false,
  noScroll: false,
  permanentTrackX: false,
  permanentTrackY: false,
  permanentTracks: false,
  removeTracksWhenNotUsed: true,
  removeTrackYWhenNotUsed: true,
  removeTrackXWhenNotUsed: true,
  wrapperProps: {},
  contentProps: {},
  trackXProps: {},
  trackYProps: {},
  thumbXProps: {},
  thumbYProps: {}
});