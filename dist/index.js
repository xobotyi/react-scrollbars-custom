"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _Thumb = _interopRequireDefault(require("./Thumb"));

var _Track = _interopRequireWildcard(require("./Track"));

var _getInnerSizes = require("./util/getInnerSizes");

var _getScrollbarWidth = _interopRequireDefault(require("./util/getScrollbarWidth"));

var _LoopController = _interopRequireDefault(require("./util/LoopController"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

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
    /**
     * @property {ScrollValues} scrollValues
     */

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleScrollEvent", function () {
      _this.scrollDetect();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "scrollDetect", function () {
      if (!_this.props.onScrollStart && !_this.props.onScrollStop) {
        return;
      }

      !_this.scrollDetect.timeout && _this.props.onScrollStart && _this.props.onScrollStart.call(_assertThisInitialized(_assertThisInitialized(_this)), _this.scrollValues);
      _this.scrollDetect.timeout && clearTimeout(_this.scrollDetect.timeout);
      _this.scrollDetect.timeout = setTimeout(function () {
        _this.scrollDetect.timeout = null;
        _this.props.onScrollStop && _this.props.onScrollStop.call(_assertThisInitialized(_assertThisInitialized(_this)), _this.scrollValues);
      }, _this.props.scrollDetectionThreshold);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "update", function () {
      var forced = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (typeof _this.state.isRtl !== "boolean") {
        _this.setState({
          isRtl: getComputedStyle(_this.contentEl).direction === "rtl"
        });

        return _this.scrollValues;
      }
      /**
       *
       * @type {ScrollValues}
       */


      var currentScrollValues = {
        clientHeight: _this.contentEl.clientHeight,
        scrollHeight: _this.contentEl.scrollHeight,
        scrollTop: _this.contentEl.scrollTop,
        clientWidth: _this.contentEl.clientWidth,
        scrollWidth: _this.contentEl.scrollWidth,
        scrollLeft: _this.contentEl.scrollLeft,
        scrollXBlocked: null,
        scrollYBlocked: null,
        scrollXPossible: null,
        scrollYPossible: null,
        trackXVisible: null,
        trackYVisible: null,
        isRtl: _this.state.isRtl
      };
      currentScrollValues.scrollXBlocked = _this.props.noScroll || _this.props.noScrollX;
      currentScrollValues.scrollYBlocked = _this.props.noScroll || _this.props.noScrollY;
      currentScrollValues.scrollXPossible = !currentScrollValues.scrollXBlocked && currentScrollValues.scrollWidth > currentScrollValues.clientWidth;
      currentScrollValues.scrollYPossible = !currentScrollValues.scrollYBlocked && currentScrollValues.scrollHeight > currentScrollValues.clientHeight;
      currentScrollValues.trackXVisible = currentScrollValues.scrollXPossible || _this.props.permanentTracks || _this.props.permanentTrackX;
      currentScrollValues.trackYVisible = currentScrollValues.scrollYPossible || _this.props.permanentTracks || _this.props.permanentTrackY;
      var mask = 0;
      _this.scrollValues.clientHeight !== currentScrollValues.clientHeight && (mask |= 1 << 0);
      _this.scrollValues.clientWidth !== currentScrollValues.clientWidth && (mask |= 1 << 1);
      _this.scrollValues.scrollHeight !== currentScrollValues.scrollHeight && (mask |= 1 << 2);
      _this.scrollValues.scrollWidth !== currentScrollValues.scrollWidth && (mask |= 1 << 3);
      _this.scrollValues.scrollTop !== currentScrollValues.scrollTop && (mask |= 1 << 4);
      _this.scrollValues.scrollLeft !== currentScrollValues.scrollLeft && (mask |= 1 << 5);
      _this.scrollValues.scrollYBlocked !== currentScrollValues.scrollYBlocked && (mask |= 1 << 6);
      _this.scrollValues.scrollXBlocked !== currentScrollValues.scrollXBlocked && (mask |= 1 << 7);
      _this.scrollValues.scrollYPossible !== currentScrollValues.scrollYPossible && (mask |= 1 << 8);
      _this.scrollValues.scrollXPossible !== currentScrollValues.scrollXPossible && (mask |= 1 << 9);
      _this.scrollValues.trackYVisible !== currentScrollValues.trackYVisible && (mask |= 1 << 10);
      _this.scrollValues.trackXVisible !== currentScrollValues.trackXVisible && (mask |= 1 << 11);
      _this.scrollValues.isRtl !== currentScrollValues.isRtl && (mask |= 1 << 12); // if not forced and nothing has changed - do not update

      if (mask === 0 && !forced) {
        return _this.scrollValues;
      } // if scrollbars visibility has changed


      if (mask & 1 << 10 || mask & 1 << 11) {
        _this.scrollValues.trackYVisible = currentScrollValues.trackYVisible;
        _this.scrollValues.trackXVisible = currentScrollValues.trackXVisible;

        _this.setState({
          trackYVisible: currentScrollValues.trackYVisible,
          trackXVisible: currentScrollValues.trackXVisible
        });

        return _this.update(true);
      }

      var prevScrollValues = _this.scrollValues;
      _this.scrollValues = currentScrollValues; // if Y track rendered and changed anything related to scrollY

      if (_this.trackYEl) {
        mask & 1 << 10 && (_this.trackYEl.style.display = currentScrollValues.trackYVisible ? null : "none");

        if (mask & 1 << 0 || mask & 1 << 2 || mask & 1 << 4 || mask & 1 << 6 || mask & 1 << 8) {
          if (currentScrollValues.scrollYPossible) {
            var trackSize = (0, _getInnerSizes.getInnerHeight)(_this.trackYEl);
            var thumbSize = Scrollbar.computeThumbSize(trackSize, currentScrollValues.scrollHeight, currentScrollValues.clientHeight, _this.props.minimalThumbsSize);
            var thumbOffset = Scrollbar.computeThumbOffset(trackSize, thumbSize, currentScrollValues.scrollHeight, currentScrollValues.clientHeight, currentScrollValues.scrollTop);
            _this.thumbYEl.style.transform = "translateY(".concat(thumbOffset, "px)");
            _this.thumbYEl.style.height = thumbSize + "px";
            _this.thumbYEl.style.display = null;
          } else {
            _this.thumbYEl.style.transform = null;
            _this.thumbYEl.style.height = "0px";
            _this.thumbYEl.style.display = "none";
          }
        }
      } // if X track rendered and changed anything related to scrollX


      if (_this.trackXEl) {
        mask & 1 << 11 && (_this.trackXEl.style.display = currentScrollValues.trackXVisible ? null : "none");

        if (mask & 1 << 1 || mask & 1 << 3 || mask & 1 << 5 || mask & 1 << 7 || mask & 1 << 9) {
          if (currentScrollValues.scrollXPossible) {
            var _trackSize = (0, _getInnerSizes.getInnerWidth)(_this.trackXEl);

            var _thumbSize = Scrollbar.computeThumbSize(_trackSize, currentScrollValues.scrollWidth, currentScrollValues.clientWidth, _this.props.minimalThumbsSize);

            var _thumbOffset = Scrollbar.computeThumbOffset(_trackSize, _thumbSize, currentScrollValues.scrollWidth, currentScrollValues.clientWidth, currentScrollValues.scrollLeft);

            if (_this.state.isRtl) {
              _thumbOffset = _thumbSize + _thumbOffset - _trackSize;
            }

            _this.thumbXEl.style.transform = "translateX(".concat(_thumbOffset, "px)");
            _this.thumbXEl.style.width = _thumbSize + "px";
            _this.thumbXEl.style.display = null;
          } else {
            _this.thumbXEl.style.transform = null;
            _this.thumbXEl.style.width = "0px";
            _this.thumbXEl.style.display = "none";
          }
        }
      }

      if (_this.props.translateContentSizesToHolder && _this.wrapperEl && (mask & 1 << 2 || mask & 1 << 3)) {
        _this.holderEl.style.width = currentScrollValues.scrollWidth + "px";
        _this.holderEl.style.height = currentScrollValues.scrollHeight + "px";
      }

      if (prevScrollValues.scrollTop !== null) {
        _this.props.onScroll && _this.props.onScroll(_this.scrollValues, prevScrollValues);
      }

      return _this.scrollValues;
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

    _this.scrollValues = {
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
    _this.state = {
      trackYVisible: true,
      trackXVisible: true,
      isRtl: _this.props.rtl
    };
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
     *
     * @param forced
     * @return {ScrollValues}
     */

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
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
          props = _objectWithoutProperties(_this$props, ["minimalThumbsSize", "fallbackScrollbarWidth", "scrollDetectionThreshold", "tagName", "className", "style", "trackClickBehavior", "rtl", "momentum", "noDefaultStyles", "translateContentSizesToHolder", "noScrollX", "noScrollY", "noScroll", "permanentTrackX", "permanentTrackY", "permanentTracks", "removeTracksWhenNotUsed", "removeTrackYWhenNotUsed", "removeTrackXWhenNotUsed", "wrapperProps", "contentProps", "trackXProps", "trackYProps", "thumbXProps", "thumbYProps", "wrapperRenderer", "contentRenderer", "trackXRenderer", "trackYRenderer", "thumbXRenderer", "thumbYRenderer", "onScroll", "onScrollStart", "onScrollStop", "children"]);

      var _this$state = this.state,
          trackXVisible = _this$state.trackXVisible,
          trackYVisible = _this$state.trackYVisible;
      var browserSBW = (0, _getScrollbarWidth.default)();
      var scrollbarWidth = browserSBW || fallbackScrollbarWidth;

      var wrapperProps = _objectSpread({}, propsWrapperProps),
          contentProps = _objectSpread({}, propsContentProps),
          trackXProps = _objectSpread({}, propsTrackXProps),
          trackYProps = _objectSpread({}, propsTrackYProps),
          thumbXProps = _objectSpread({}, propsThumbXProps),
          thumbYProps = _objectSpread({}, propsThumbYProps);

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
        overflowY: this.scrollValues.scrollYPossible ? "scroll" : "hidden"
      }, this.state.isRtl ? {
        paddingLeft: !browserSBW && this.scrollValues.scrollYPossible ? scrollbarWidth : null,
        marginLeft: this.scrollValues.scrollYPossible ? -scrollbarWidth : null
      } : {
        paddingRight: !browserSBW && this.scrollValues.scrollYPossible ? scrollbarWidth : null,
        marginRight: this.scrollValues.scrollYPossible ? -scrollbarWidth : null
      }, {
        overflowX: this.scrollValues.scrollXPossible ? "scroll" : "hidden",
        paddingBottom: !browserSBW && this.scrollValues.scrollXPossible ? scrollbarWidth : null,
        marginBottom: this.scrollValues.scrollXPossible ? -scrollbarWidth : null
      });
      trackXProps.style = _objectSpread({}, trackXProps.style, propsTrackXProps.style);
      trackYProps.style = _objectSpread({}, trackYProps.style, propsTrackYProps.style);
      thumbXProps.style = _objectSpread({}, thumbXProps.style, propsThumbXProps.style);
      thumbYProps.style = _objectSpread({}, thumbYProps.style, propsThumbYProps.style);
      props.className = "ScrollbarsCustom" + (trackYVisible ? " trackYVisible" : "") + (trackYVisible ? " trackXVisible" : "") + (this.state.isRtl ? " rtl" : "") + (className ? " " + className : "");
      contentProps.className = "content" + (contentProps.className ? " " + contentProps.className : "");
      wrapperProps.className = "wrapper" + (wrapperProps.className ? " " + wrapperProps.className : "");

      props.ref = function (ref) {
        _this2.holderEl = ref;
      };

      wrapperProps.ref = function (ref) {
        _this2.wrapperEl = ref;
      };

      contentProps.ref = function (ref) {
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
  tagName: "div",
  minimalThumbsSize: 30,
  fallbackScrollbarWidth: 20,
  trackClickBehavior: "jump",
  momentum: false,
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