"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _raf2 = require("raf");

var _raf3 = _interopRequireDefault(_raf2);

var _react = require("react");

var _getInnerSizes = require("../util/getInnerSizes");

var _utilities = require("../util/utilities");

var _defaultElementRender = require("./defaultElementRender");

var defaultElementRender = _interopRequireWildcard(_defaultElementRender);

var _defaultElementStyle = require("./defaultElementStyle");

var defaultElementStyles = _interopRequireWildcard(_defaultElementStyle);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scrollbar = function (_Component) {
    _inherits(Scrollbar, _Component);

    function Scrollbar() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Scrollbar);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Scrollbar.__proto__ || Object.getPrototypeOf(Scrollbar)).call.apply(_ref, [this].concat(args))), _this), _this.addListeners = function () {
            if (!(0, _utilities.isset)(document) || !_this.content) {
                return _this;
            }

            var _this2 = _this,
                content = _this2.content,
                trackVertical = _this2.trackVertical,
                trackHorizontal = _this2.trackHorizontal,
                thumbVertical = _this2.thumbVertical,
                thumbHorizontal = _this2.thumbHorizontal;
            var _this$props = _this.props,
                noScroll = _this$props.noScroll,
                scrollY = _this$props.scrollY,
                scrollX = _this$props.scrollX;


            if (noScroll) {
                _this.removeListeners();

                return _this;
            } else {
                window.addEventListener("resize", _this.handleWindowResizeEvent, { passive: true });
                content.addEventListener("scroll", _this.handleScrollEvent, { passive: true });
            }

            if (scrollY) {
                trackVertical.addEventListener("mousedown", _this.handleTrackVerticalMousedownEvent);
                thumbVertical.addEventListener("mousedown", _this.handleThumbVerticalMousedownEvent);
            } else {
                trackVertical.removeEventListener("mousedown", _this.handleTrackVerticalMousedownEvent);
                thumbVertical.removeEventListener("mousedown", _this.handleThumbVerticalMousedownEvent);
            }

            if (scrollX) {
                trackHorizontal.addEventListener("mousedown", _this.handleTrackHorizontalMousedownEvent);
                thumbHorizontal.addEventListener("mousedown", _this.handleThumbHorizontalMousedownEvent);
            } else {
                trackHorizontal.removeEventListener("mousedown", _this.handleTrackHorizontalMousedownEvent);
                thumbHorizontal.removeEventListener("mousedown", _this.handleThumbHorizontalMousedownEvent);
            }

            return _this;
        }, _this.removeListeners = function () {
            if (!(0, _utilities.isset)(document) || !_this.content) {
                return _this;
            }

            var _this3 = _this,
                content = _this3.content,
                trackVertical = _this3.trackVertical,
                trackHorizontal = _this3.trackHorizontal,
                thumbVertical = _this3.thumbVertical,
                thumbHorizontal = _this3.thumbHorizontal;


            window.removeEventListener("resize", _this.handleWindowResizeEvent);
            content.removeEventListener("scroll", _this.handleScrollEvent);
            trackVertical.removeEventListener("mousedown", _this.handleTrackVerticalMousedownEvent);
            trackHorizontal.removeEventListener("mousedown", _this.handleTrackHorizontalMousedownEvent);
            thumbVertical.removeEventListener("mousedown", _this.handleThumbVerticalMousedownEvent);
            thumbHorizontal.removeEventListener("mousedown", _this.handleThumbHorizontalMousedownEvent);

            return _this;
        }, _this.handleScrollEvent = function (e) {
            _this.update(function (values) {
                if ((0, _utilities.isFunction)(_this.props.onScroll)) {
                    _this.props.onScroll(_extends({}, values, { event: e }));
                }
            });

            _this.scrollDetect();
        }, _this.scrollDetect = function () {
            if (_this.scrolling) {
                return;
            }

            _this.scrolling = true;

            if ((0, _utilities.isFunction)(_this.props.onScrollStart)) {
                _this.props.onScrollStart(_this.getScrollValues());
            }

            _this.scrollDetect.interval = setInterval(function () {
                if (_this.scrollDetect.lastScrollTop === _this.content.scrollTop && _this.scrollDetect.lastScrollLeft === _this.content.scrollLeft && !_this.drag) {
                    clearInterval(_this.scrollDetect.interval);
                    _this.scrolling = false;

                    if ((0, _utilities.isFunction)(_this.props.onScrollStop)) {
                        _this.props.onScrollStop(_this.getScrollValues());
                    }
                }

                _this.scrollDetect.lastScrollTop = _this.content.scrollTop;
                _this.scrollDetect.lastScrollLeft = _this.content.scrollLeft;
            }, _this.props.scrollDetectionThreshold);
        }, _this.handleWindowResizeEvent = function () {
            _this.update();
        }, _this.handleTrackVerticalMousedownEvent = function (e) {
            if (e.which !== 1) {
                return;
            }
            e.preventDefault();

            var offset = Math.abs(e.target.getBoundingClientRect().top - e.clientY) - _this.thumbVertical.clientHeight / 2;

            _this.content.scrollTop = _this.computeScrollTopForThumbOffset(offset);
        }, _this.handleTrackHorizontalMousedownEvent = function (e) {
            if (e.which !== 1) {
                return;
            }
            e.preventDefault();

            var offset = Math.abs(e.target.getBoundingClientRect().left - e.clientX) - _this.thumbHorizontal.clientWidth / 2;

            _this.content.scrollLeft = _this.computeScrollLeftForThumbOffset(offset);
        }, _this.handleThumbVerticalMousedownEvent = function (e) {
            if (e.which !== 1) {
                return;
            }
            e.preventDefault();
            e.stopImmediatePropagation();

            _this.handleDragStart();

            var target = e.target,
                clientY = e.clientY;

            _this.dragPrevPageY = target.clientHeight - (clientY - target.getBoundingClientRect().top);
            _this.thumbVertical.classList.add("dragging");
        }, _this.handleThumbHorizontalMousedownEvent = function (e) {
            if (e.which !== 1) {
                return;
            }
            e.preventDefault();
            e.stopImmediatePropagation();

            _this.handleDragStart();

            var target = e.target,
                clientX = e.clientX;

            _this.dragPrevPageX = target.clientWidth - (clientX - target.getBoundingClientRect().left);
            _this.thumbHorizontal.classList.add("dragging");
        }, _this.handleDragStart = function () {
            _this.drag = true;
            _this.scrollDetect();

            document.addEventListener("mousemove", _this.handleDragEvent);
            document.addEventListener("mouseup", _this.handleDragEnd);

            document.body.style.userSelect = "none";
            document.onselectstart = function () {
                return false;
            };
        }, _this.handleDragEnd = function () {
            _this.drag = false;
            _this.dragPrevPageX = _this.dragPrevPageY = 0;

            document.removeEventListener("mousemove", _this.handleDragEvent);
            document.removeEventListener("mouseup", _this.handleDragEnd);

            document.body.style.userSelect = null;
            delete document.onselectstart;

            _this.thumbHorizontal.classList.remove("dragging");
            _this.thumbVertical.classList.remove("dragging");
        }, _this.handleDragEvent = function (e) {
            if (_this.dragPrevPageX) {
                var offset = -_this.trackHorizontal.getBoundingClientRect().left + e.clientX - (_this.thumbHorizontal.clientWidth - _this.dragPrevPageX);
                _this.content.scrollLeft = _this.computeScrollLeftForThumbOffset(offset);
            }
            if (_this.dragPrevPageY) {
                var _offset = -_this.trackVertical.getBoundingClientRect().top + e.clientY - (_this.thumbVertical.clientHeight - _this.dragPrevPageY);
                _this.content.scrollTop = _this.computeScrollTopForThumbOffset(_offset);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Scrollbar, [{
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            this.handleDragEnd();
            this.removeListeners();
            this.contentSizeTrackStop();

            _raf3.default.cancel(this.requestFrame);

            if (this.scrollDetect.interval) {
                clearInterval(this.scrollDetect.interval);
                delete this.scrollDetect.interval;
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.addListeners();
            this.update();

            if (this.props.contentSizeTrack) {
                this.contentSizeTrackStart();
            }
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            this.update();

            var _content = this.content,
                _content$scrollHeight = _content.scrollHeight,
                scrollHeight = _content$scrollHeight === undefined ? 0 : _content$scrollHeight,
                _content$scrollWidth = _content.scrollWidth,
                scrollWidth = _content$scrollWidth === undefined ? 0 : _content$scrollWidth,
                _content$clientHeight = _content.clientHeight,
                clientHeight = _content$clientHeight === undefined ? 0 : _content$clientHeight,
                _content$clientWidth = _content.clientWidth,
                clientWidth = _content$clientWidth === undefined ? 0 : _content$clientWidth;

            this.contentSizeTrackPreviousSize = { scrollHeight: scrollHeight, scrollWidth: scrollWidth, clientHeight: clientHeight, clientWidth: clientWidth };

            this.addListeners();
        }
    }, {
        key: "componentWillUpdate",
        value: function componentWillUpdate(nextProps) {
            if (nextProps.contentSizeTrack !== this.props.contentSizeTrack) {
                if (nextProps.contentSizeTrack) {
                    this.contentSizeTrackStart();
                } else {
                    this.contentSizeTrackStop();
                }
            } else if (nextProps.contentSizeTrack && nextProps.contentSizeTrackInterval !== this.props.contentSizeTrackInterval) {
                this.contentSizeTrackStop();
                this.contentSizeTrackStart();
            }
        }

        /**
         * @return {Scrollbar}
         */


        /**
         * @return {Scrollbar}
         */

    }, {
        key: "scrollToTop",


        /**
         * Scrol to the top border
         *
         * @return {Scrollbar}
         */
        value: function scrollToTop() {
            if (!this.content) {
                return this;
            }
            this.content.scrollTop = 0;

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
            if (!this.content) {
                return this;
            }
            this.content.scrollTop = this.content.scrollHeight;

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
            if (!this.content) {
                return this;
            }
            this.content.scrollLeft = 0;

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
            if (!this.content) {
                return this;
            }
            this.content.scrollLeft = this.content.scrollWidth;

            return this;
        }

        //==============//
        //   handlers   //
        //==============//

    }, {
        key: "raf",


        //================//
        //   assistance   //
        //================//
        /**
         * Request animation frame and call given function inside
         *
         * @param cb {function|undefined} Function to call in requested frame
         * @return {Scrollbar}
         */
        value: function raf(cb) {
            var _this4 = this;

            if ((0, _utilities.isset)(this.requestFrame)) {
                _raf3.default.cancel(this.requestFrame);
            }

            this.requestFrame = (0, _raf3.default)(function () {
                delete _this4.requestFrame;
                cb();
            });

            return this;
        }

        /**
         * Request animation frame and actualize the scrollbars
         *
         * @param cb {function|undefined} The function to call after actualisation
         * @return {Scrollbar}
         */

    }, {
        key: "update",
        value: function update(cb) {
            var _this5 = this;

            this.raf(function () {
                return _this5.actualizeScrollbars(cb);
            });

            return this;
        }

        /**
         * Return values representing current scrolling position
         *
         * @return {{left: number, top: number, scrollLeft: number, scrollTop: number, scrollWidth: number, scrollHeight: number, clientWidth: number, clientHeight: number}}
         */

    }, {
        key: "getScrollValues",
        value: function getScrollValues() {
            var _ref2 = this.content || {},
                _ref2$scrollLeft = _ref2.scrollLeft,
                scrollLeft = _ref2$scrollLeft === undefined ? 0 : _ref2$scrollLeft,
                _ref2$scrollTop = _ref2.scrollTop,
                scrollTop = _ref2$scrollTop === undefined ? 0 : _ref2$scrollTop,
                _ref2$scrollWidth = _ref2.scrollWidth,
                scrollWidth = _ref2$scrollWidth === undefined ? 0 : _ref2$scrollWidth,
                _ref2$scrollHeight = _ref2.scrollHeight,
                scrollHeight = _ref2$scrollHeight === undefined ? 0 : _ref2$scrollHeight,
                _ref2$clientWidth = _ref2.clientWidth,
                clientWidth = _ref2$clientWidth === undefined ? 0 : _ref2$clientWidth,
                _ref2$clientHeight = _ref2.clientHeight,
                clientHeight = _ref2$clientHeight === undefined ? 0 : _ref2$clientHeight;

            this.scrollValues = {
                left: scrollLeft / (scrollWidth - clientWidth) || 0,
                top: scrollTop / (scrollHeight - clientHeight) || 0,
                scrollTop: scrollTop,
                scrollLeft: scrollLeft,
                scrollHeight: scrollHeight,
                scrollWidth: scrollWidth,
                clientWidth: clientWidth,
                clientHeight: clientHeight
            };

            return this.scrollValues;
        }

        /**
         * Returns vertical thumb height corresponding viewport height to scrollable content height ratio
         *
         * @param trackHeight {number} Height of track where thumb placed
         * @return {number}
         */

    }, {
        key: "computeThumbVerticalHeight",
        value: function computeThumbVerticalHeight(trackHeight) {
            var _content2 = this.content,
                scrollHeight = _content2.scrollHeight,
                clientHeight = _content2.clientHeight;
            var thumbSizeMin = this.props.thumbSizeMin;

            var height = Math.ceil(clientHeight / scrollHeight * trackHeight);

            return trackHeight === height ? 0 : Math.max(height, thumbSizeMin);
        }

        /**
         * Returns content"s scrollTop value corresponding given thumb offset
         *
         * @param offset {number} Thumb"s offset top, in pixels
         * @return {number}
         */

    }, {
        key: "computeScrollTopForThumbOffset",
        value: function computeScrollTopForThumbOffset(offset) {
            var _content3 = this.content,
                clientHeight = _content3.clientHeight,
                scrollHeight = _content3.scrollHeight;

            var trackVerticalInnerHeight = (0, _getInnerSizes.getInnerHeight)(this.trackVertical);
            var thumbVerticalHeight = this.thumbVertical.clientHeight;

            return offset / (trackVerticalInnerHeight - thumbVerticalHeight) * (scrollHeight - clientHeight);
        }

        /**
         * Returns horizontal thumb width corresponding viewport width to scrollable content width ratio
         *
         * @param trackWidth {number} Width of track where thumb placed
         * @return {number}
         */

    }, {
        key: "computeThumbHorizontalWidth",
        value: function computeThumbHorizontalWidth(trackWidth) {
            var _content4 = this.content,
                scrollWidth = _content4.scrollWidth,
                clientWidth = _content4.clientWidth;
            var thumbSizeMin = this.props.thumbSizeMin;

            var width = Math.ceil(clientWidth / scrollWidth * trackWidth);

            return trackWidth === width ? 0 : Math.max(width, thumbSizeMin);
        }

        /**
         * Returns content"s scrollLeft value corresponding given thumb offset
         *
         * @param offset {number} Thumb"s offset left, in pixels
         * @return {number}
         */

    }, {
        key: "computeScrollLeftForThumbOffset",
        value: function computeScrollLeftForThumbOffset(offset) {
            var _content5 = this.content,
                clientWidth = _content5.clientWidth,
                scrollWidth = _content5.scrollWidth;

            var trackHorizontalInnerWidth = (0, _getInnerSizes.getInnerWidth)(this.trackHorizontal);
            var thumbHorizontalWidth = this.thumbHorizontal.clientWidth;

            return offset / (trackHorizontalInnerWidth - thumbHorizontalWidth) * (scrollWidth - clientWidth);
        }

        /**
         * Actualizes scrollbars visibility and thumbs sizes and positions
         *
         * @param cb {function|undefined} The function to call after actualisation
         * @return {Scrollbar}
         */

    }, {
        key: "actualizeScrollbars",
        value: function actualizeScrollbars(cb) {
            var scrollValues = this.getScrollValues();
            var scrollLeft = scrollValues.scrollLeft,
                scrollTop = scrollValues.scrollTop,
                clientWidth = scrollValues.clientWidth,
                scrollWidth = scrollValues.scrollWidth,
                clientHeight = scrollValues.clientHeight,
                scrollHeight = scrollValues.scrollHeight;


            var verticalScrollPossible = scrollHeight >= clientHeight && !this.props.noScroll && this.props.scrollY,
                horizontalScrollPossible = scrollWidth >= clientWidth && !this.props.noScroll && this.props.scrollX;

            var oldVerticalTrackDisplay = this.trackVertical.style.display,
                oldHorizontalTrackDisplay = this.trackHorizontal.style.display;

            if (this.trackVertical.style.display === "none" && verticalScrollPossible) {
                this.trackVertical.style.display = null;
                this.trackVertical.visibility = "hidden";
            }
            if (this.trackHorizontal.style.display === "none" && horizontalScrollPossible) {
                this.trackHorizontal.style.display = null;
                this.trackHorizontal.visibility = "hidden";
            }

            var trackHorizontalInnerWidth = (0, _getInnerSizes.getInnerWidth)(this.trackHorizontal),
                trackVerticalInnerHeight = (0, _getInnerSizes.getInnerHeight)(this.trackVertical);

            var thumbVerticalHeight = this.computeThumbVerticalHeight(trackVerticalInnerHeight),
                thumbHorizontalWidth = this.computeThumbHorizontalWidth(trackHorizontalInnerWidth);

            this.trackVertical.style.display = this.props.permanentScrollbars || this.props.permanentScrollbarVertical || thumbVerticalHeight ? null : "none";
            this.trackVertical.visibility = null;

            this.trackHorizontal.style.display = this.props.permanentScrollbars || this.props.permanentScrollbarHorizontal || thumbHorizontalWidth ? null : "none";
            this.trackHorizontal.visibility = null;

            if (oldVerticalTrackDisplay !== this.trackVertical.style.display || oldHorizontalTrackDisplay !== this.trackHorizontal.style.display) {
                this.actualizeScrollbars(cb);
                return this;
            }

            var thumbVerticalOffset = thumbVerticalHeight ? scrollTop / (scrollHeight - clientHeight) * (trackVerticalInnerHeight - thumbVerticalHeight) : 0,
                thumbHorizontalOffset = thumbHorizontalWidth ? scrollLeft / (scrollWidth - clientWidth) * (trackHorizontalInnerWidth - thumbHorizontalWidth) : 0;

            this.thumbVertical.style.transform = "translateY(" + thumbVerticalOffset + "px)";
            this.thumbVertical.style.height = thumbVerticalHeight + "px";

            this.thumbHorizontal.style.transform = "translateX(" + thumbHorizontalOffset + "px)";
            this.thumbHorizontal.style.width = thumbHorizontalWidth + "px";

            if ((0, _utilities.isFunction)(this.refs.onUpdate)) {
                this.refs.onUpdate(scrollValues);
            }
            if ((0, _utilities.isFunction)(cb)) {
                cb(scrollValues);
            }

            return this;
        }

        /**
         * @return {Scrollbar}
         */

    }, {
        key: "contentSizeTrackStart",
        value: function contentSizeTrackStart() {
            var _this6 = this;

            if (!this.content || this.contentSizeTrackInterval) {
                return this;
            }

            var _content6 = this.content,
                _content6$scrollHeigh = _content6.scrollHeight,
                scrollHeight = _content6$scrollHeigh === undefined ? 0 : _content6$scrollHeigh,
                _content6$scrollWidth = _content6.scrollWidth,
                scrollWidth = _content6$scrollWidth === undefined ? 0 : _content6$scrollWidth,
                _content6$clientHeigh = _content6.clientHeight,
                clientHeight = _content6$clientHeigh === undefined ? 0 : _content6$clientHeigh,
                _content6$clientWidth = _content6.clientWidth,
                clientWidth = _content6$clientWidth === undefined ? 0 : _content6$clientWidth;

            this.contentSizeTrackPreviousSize = { scrollHeight: scrollHeight, scrollWidth: scrollWidth, clientHeight: clientHeight, clientWidth: clientWidth };
            var contentSizeTrackInterval = this.props.contentSizeTrackInterval;


            this.contentSizeTrackInterval = setInterval(function () {
                var _content7 = _this6.content,
                    _content7$scrollHeigh = _content7.scrollHeight,
                    scrollHeight = _content7$scrollHeigh === undefined ? 0 : _content7$scrollHeigh,
                    _content7$scrollWidth = _content7.scrollWidth,
                    scrollWidth = _content7$scrollWidth === undefined ? 0 : _content7$scrollWidth,
                    _content7$clientHeigh = _content7.clientHeight,
                    clientHeight = _content7$clientHeigh === undefined ? 0 : _content7$clientHeigh,
                    _content7$clientWidth = _content7.clientWidth,
                    clientWidth = _content7$clientWidth === undefined ? 0 : _content7$clientWidth;


                if (_this6.contentSizeTrackPreviousSize.scrollHeight !== scrollHeight || _this6.contentSizeTrackPreviousSize.scrollWidth !== scrollWidth || _this6.contentSizeTrackPreviousSize.clientHeight !== clientHeight || _this6.contentSizeTrackPreviousSize.clientWidth !== clientWidth) {
                    _this6.update();
                }

                _this6.contentSizeTrackPreviousSize = { scrollHeight: scrollHeight, scrollWidth: scrollWidth, clientHeight: clientHeight, clientWidth: clientWidth };
            }, contentSizeTrackInterval);

            return this;
        }

        /**
         * @return {Scrollbar}
         */

    }, {
        key: "contentSizeTrackStop",
        value: function contentSizeTrackStop() {
            if (this.contentSizeTrackInterval) {
                clearInterval(this.contentSizeTrackInterval);
            }

            delete this.contentSizeTrackInterval;
            delete this.contentSizeTrackPreviousSize;

            return this;
        }
    }, {
        key: "render",
        value: function render() {
            var _this7 = this;

            var _props = this.props,
                style = _props.style,
                thumbSizeMin = _props.thumbSizeMin,
                defaultStyles = _props.defaultStyles,
                scrollDetectionThreshold = _props.scrollDetectionThreshold,
                permanentScrollbars = _props.permanentScrollbars,
                permanentScrollbarVertical = _props.permanentScrollbarVertical,
                permanentScrollbarHorizontal = _props.permanentScrollbarHorizontal,
                contentSizeTrack = _props.contentSizeTrack,
                contentSizeTrackInterval = _props.contentSizeTrackInterval,
                noScroll = _props.noScroll,
                scrollX = _props.scrollX,
                scrollY = _props.scrollY,
                gridless = _props.gridless,
                tagName = _props.tagName,
                className = _props.className,
                children = _props.children,
                renderWrapper = _props.renderWrapper,
                renderContent = _props.renderContent,
                renderTrackVertical = _props.renderTrackVertical,
                renderTrackHorizontal = _props.renderTrackHorizontal,
                renderThumbVertical = _props.renderThumbVertical,
                renderThumbHorizontal = _props.renderThumbHorizontal,
                onUpdate = _props.onUpdate,
                onScroll = _props.onScroll,
                onScrollStart = _props.onScrollStart,
                onScrollStop = _props.onScrollStop,
                props = _objectWithoutProperties(_props, ["style", "thumbSizeMin", "defaultStyles", "scrollDetectionThreshold", "permanentScrollbars", "permanentScrollbarVertical", "permanentScrollbarHorizontal", "contentSizeTrack", "contentSizeTrackInterval", "noScroll", "scrollX", "scrollY", "gridless", "tagName", "className", "children", "renderWrapper", "renderContent", "renderTrackVertical", "renderTrackHorizontal", "renderThumbVertical", "renderThumbHorizontal", "onUpdate", "onScroll", "onScrollStart", "onScrollStop"]);

            var browserScrollbarWidth = (0, _utilities.getScrollbarWidth)();

            var holderClassName = ["CustomScrollbar"],
                holderStyle = _extends({}, style, defaultStyles && (gridless ? defaultElementStyles.holderGridless : defaultElementStyles.holder)),
                wrapperStyle = _extends({}, defaultStyles && (gridless ? defaultElementStyles.wrapperGridless : defaultElementStyles.wrapper), { position: "relative", overflow: "hidden" }),
                contentStyle = _extends({}, defaultElementStyles.content, { overflowX: "scroll", overflowY: "scroll", marginRight: -browserScrollbarWidth, marginBottom: -browserScrollbarWidth }),
                trackVerticalStyle = _extends({}, defaultStyles && (gridless ? defaultElementStyles.trackVerticalGridless : defaultElementStyles.trackVertical)),
                thumbVerticalStyle = _extends({}, defaultStyles && defaultElementStyles.thumbVertical),
                trackHorizontalStyle = _extends({}, defaultStyles && (gridless ? defaultElementStyles.trackHorizontalGridless : defaultElementStyles.trackHorizontal)),
                thumbHorizontalStyle = _extends({}, defaultStyles && defaultElementStyles.thumbHorizontal);

            if (noScroll || !scrollY && !scrollX) {
                contentStyle.marginRight = contentStyle.marginBottom = null;
                contentStyle.overflowX = contentStyle.overflowY = "hidden";

                trackVerticalStyle.display = trackHorizontalStyle.display = "none";
            } else if (!scrollY) {
                contentStyle.marginRight = null;
                contentStyle.overflowX = "scroll";
                contentStyle.overflowY = "hidden";

                trackVerticalStyle.display = "none";
            } else if (!scrollX) {
                contentStyle.marginBottom = null;
                contentStyle.overflowY = "scroll";
                contentStyle.overflowX = "hidden";

                trackHorizontalStyle.display = "none";
            }

            if (permanentScrollbars || permanentScrollbarVertical) {
                trackVerticalStyle.display = null;

                if (noScroll || !scrollY) {
                    thumbVerticalStyle.display = "none";
                }
            } else if (!browserScrollbarWidth) {
                trackVerticalStyle.display = "none";
            }

            if (permanentScrollbars || permanentScrollbarHorizontal) {
                trackHorizontalStyle.display = null;

                if (noScroll || !scrollX) {
                    thumbHorizontalStyle.display = "none";
                }
            } else if (!browserScrollbarWidth) {
                trackHorizontalStyle.display = "none";
            }

            if (className) {
                if (typeof className === "string") {
                    holderClassName.push(className);
                } else {
                    holderClassName.concat(className);
                }
            }

            return (0, _react.createElement)(tagName, _extends({}, props, { className: holderClassName.join(" "), style: holderStyle, ref: function ref(_ref3) {
                    _this7.holder = _ref3;
                } }), [renderWrapper({
                key: "wrapper",
                ref: function ref(_ref4) {
                    _this7.wrapper = _ref4;
                },
                style: wrapperStyle,
                children: renderContent({
                    key: "content",
                    ref: function ref(_ref5) {
                        _this7.content = _ref5;
                    },
                    style: contentStyle,
                    children: children
                })
            }), renderTrackVertical({
                key: "trackVertical",
                ref: function ref(_ref6) {
                    _this7.trackVertical = _ref6;
                },
                style: trackVerticalStyle,
                children: renderThumbVertical({
                    key: "thumbVertical",
                    ref: function ref(_ref7) {
                        _this7.thumbVertical = _ref7;
                    },
                    style: thumbVerticalStyle
                })
            }), renderTrackHorizontal({
                key: "trackHorizontal",
                ref: function ref(_ref8) {
                    _this7.trackHorizontal = _ref8;
                },
                style: trackHorizontalStyle,
                children: renderThumbHorizontal({
                    key: "thumbHorizontal",
                    ref: function ref(_ref9) {
                        _this7.thumbHorizontal = _ref9;
                    },
                    style: thumbHorizontalStyle
                })
            })]);
        }
    }, {
        key: "scrollTop",


        /**
         * Return the vertical scroll position
         *
         * @return {number}
         */
        get: function get() {
            if (!this.content) {
                return 0;
            }

            return this.content.scrollTop;
        }

        //==============//
        /**
         * Set the vertical scroll to given amount of pixels
         *
         * @param top {number} Pixels amount
         */
        ,
        set: function set(top) {
            if (!this.content) {
                return;
            }

            this.content.scrollTop = top;
            this.update();
        }

        /**
         * Return the horizontal scroll position
         *
         * @return {number}
         */

    }, {
        key: "scrollLeft",
        get: function get() {
            if (!this.content) {
                return 0;
            }

            return this.content.scrollLeft;
        }

        /**
         * Set the horizontal scroll to given amount of pixels
         *
         * @param left {number} Pixels amount
         */
        ,
        set: function set(left) {
            if (!this.content) {
                return;
            }

            this.content.scrollLeft = left;
            this.update();
        }

        /**
         * @return {number}
         */

    }, {
        key: "scrollHeight",
        get: function get() {
            if (!this.content) {
                return 0;
            }

            return this.content.scrollHeight;
        }

        /**
         * @return {number}
         */

    }, {
        key: "scrollWidth",
        get: function get() {
            if (!this.content) {
                return 0;
            }
            return this.content.scrollWidth;
        }

        //==============//
        //     api      //

        /**
         * @return {number}
         */

    }, {
        key: "clientHeight",
        get: function get() {
            if (!this.content) {
                return 0;
            }

            return this.content.clientHeight;
        }

        /**
         * @return {number}
         */

    }, {
        key: "clientWidth",
        get: function get() {
            if (!this.content) {
                return 0;
            }

            return this.content.clientWidth;
        }
    }]);

    return Scrollbar;
}(_react.Component);

Scrollbar.propTypes = {
    thumbSizeMin: _propTypes2.default.number,
    scrollDetectionThreshold: _propTypes2.default.number,
    defaultStyles: _propTypes2.default.bool,
    permanentScrollbars: _propTypes2.default.bool,
    permanentScrollbarVertical: _propTypes2.default.bool,
    permanentScrollbarHorizontal: _propTypes2.default.bool,
    contentSizeTrack: _propTypes2.default.bool,
    contentSizeTrackInterval: _propTypes2.default.number,

    noScroll: _propTypes2.default.bool,
    scrollX: _propTypes2.default.bool,
    scrollY: _propTypes2.default.bool,
    gridless: _propTypes2.default.bool,

    onUpdate: _propTypes2.default.func,
    onScroll: _propTypes2.default.func,
    onScrollStart: _propTypes2.default.func,
    onScrollStop: _propTypes2.default.func,

    tagName: _propTypes2.default.string,
    className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array]),

    renderWrapper: _propTypes2.default.func,
    renderContent: _propTypes2.default.func,
    renderTrackVertical: _propTypes2.default.func,
    renderTrackHorizontal: _propTypes2.default.func,
    renderThumbVertical: _propTypes2.default.func,
    renderThumbHorizontal: _propTypes2.default.func,
    children: _propTypes2.default.node
};
Scrollbar.defaultProps = {
    defaultStyles: true,
    thumbSizeMin: 30,
    scrollDetectionThreshold: 100,
    permanentScrollbars: false,
    permanentScrollbarVertical: false,
    permanentScrollbarHorizontal: false,
    contentSizeTrack: false,
    contentSizeTrackInterval: 200,

    noScroll: false,
    scrollX: true,
    scrollY: true,
    gridless: false,

    tagName: "div",
    renderWrapper: defaultElementRender.wrapper,
    renderContent: defaultElementRender.content,
    renderTrackVertical: defaultElementRender.trackVertical,
    renderTrackHorizontal: defaultElementRender.trackHorizontal,
    renderThumbVertical: defaultElementRender.thumbVertical,
    renderThumbHorizontal: defaultElementRender.thumbHorizontal
};
exports.default = Scrollbar;