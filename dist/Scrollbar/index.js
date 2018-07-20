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

    //==============//
    //   bindings   //
    //==============//
    function Scrollbar(props) {
        var _ref;

        _classCallCheck(this, Scrollbar);

        for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            rest[_key - 1] = arguments[_key];
        }

        // event handlers has to be hard binded to current instance
        var _this = _possibleConstructorReturn(this, (_ref = Scrollbar.__proto__ || Object.getPrototypeOf(Scrollbar)).call.apply(_ref, [this, props].concat(rest)));

        _this.handleScrollEvent = _this.handleScrollEvent.bind(_this);
        _this.handleWindowResizeEvent = _this.handleWindowResizeEvent.bind(_this);
        _this.handleTrackVerticalMousedownEvent = _this.handleTrackVerticalMousedownEvent.bind(_this);
        _this.handleTrackHorizontalMousedownEvent = _this.handleTrackHorizontalMousedownEvent.bind(_this);
        _this.handleThumbVerticalMousedownEvent = _this.handleThumbVerticalMousedownEvent.bind(_this);
        _this.handleThumbHorizontalMousedownEvent = _this.handleThumbHorizontalMousedownEvent.bind(_this);
        _this.handleDragStart = _this.handleDragStart.bind(_this);
        _this.handleDragEnd = _this.handleDragEnd.bind(_this);
        _this.handleDragEvent = _this.handleDragEvent.bind(_this);
        return _this;
    }

    /**
     * Return the vertical scroll position
     *
     * @return {number}
     */


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

    }, {
        key: "addListeners",
        value: function addListeners() {
            if (!(0, _utilities.isset)(document) || !this.content) {
                return this;
            }

            var content = this.content,
                trackVertical = this.trackVertical,
                trackHorizontal = this.trackHorizontal,
                thumbVertical = this.thumbVertical,
                thumbHorizontal = this.thumbHorizontal;
            var _props = this.props,
                noScroll = _props.noScroll,
                scrollY = _props.scrollY,
                scrollX = _props.scrollX;


            if (noScroll) {
                this.removeListeners();

                return this;
            } else {
                window.addEventListener("resize", this.handleWindowResizeEvent, { passive: true });
                content.addEventListener("scroll", this.handleScrollEvent, { passive: true });
            }

            if (scrollY) {
                trackVertical.addEventListener("mousedown", this.handleTrackVerticalMousedownEvent);
                thumbVertical.addEventListener("mousedown", this.handleThumbVerticalMousedownEvent);
            } else {
                trackVertical.removeEventListener("mousedown", this.handleTrackVerticalMousedownEvent);
                thumbVertical.removeEventListener("mousedown", this.handleThumbVerticalMousedownEvent);
            }

            if (scrollX) {
                trackHorizontal.addEventListener("mousedown", this.handleTrackHorizontalMousedownEvent);
                thumbHorizontal.addEventListener("mousedown", this.handleThumbHorizontalMousedownEvent);
            } else {
                trackHorizontal.removeEventListener("mousedown", this.handleTrackHorizontalMousedownEvent);
                thumbHorizontal.removeEventListener("mousedown", this.handleThumbHorizontalMousedownEvent);
            }

            return this;
        }

        /**
         * @return {Scrollbar}
         */

    }, {
        key: "removeListeners",
        value: function removeListeners() {
            if (!(0, _utilities.isset)(document) || !this.content) {
                return this;
            }

            var content = this.content,
                trackVertical = this.trackVertical,
                trackHorizontal = this.trackHorizontal,
                thumbVertical = this.thumbVertical,
                thumbHorizontal = this.thumbHorizontal;


            window.removeEventListener("resize", this.handleWindowResizeEvent);
            content.removeEventListener("scroll", this.handleScrollEvent);
            trackVertical.removeEventListener("mousedown", this.handleTrackVerticalMousedownEvent);
            trackHorizontal.removeEventListener("mousedown", this.handleTrackHorizontalMousedownEvent);
            thumbVertical.removeEventListener("mousedown", this.handleThumbVerticalMousedownEvent);
            thumbHorizontal.removeEventListener("mousedown", this.handleThumbHorizontalMousedownEvent);

            return this;
        }

        /**
         * Scrol to the top border
         *
         * @return {Scrollbar}
         */

    }, {
        key: "scrollToTop",
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
        key: "handleScrollEvent",
        value: function handleScrollEvent(e) {
            var _this2 = this;

            this.update(function (values) {
                if ((0, _utilities.isFunction)(_this2.props.onScroll)) {
                    _this2.props.onScroll(_extends({}, values, { event: e }));
                }
            });

            this.scrollDetect();
        }
    }, {
        key: "scrollDetect",
        value: function scrollDetect() {
            var _this3 = this;

            if (this.scrolling) {
                return;
            }

            this.scrolling = true;

            if ((0, _utilities.isFunction)(this.props.onScrollStart)) {
                this.props.onScrollStart(this.getScrollValues());
            }

            this.scrollDetect.interval = setInterval(function () {
                if (_this3.scrollDetect.lastScrollTop === _this3.content.scrollTop && _this3.scrollDetect.lastScrollLeft === _this3.content.scrollLeft && !_this3.drag) {
                    clearInterval(_this3.scrollDetect.interval);
                    _this3.scrolling = false;

                    if ((0, _utilities.isFunction)(_this3.props.onScrollStop)) {
                        _this3.props.onScrollStop(_this3.getScrollValues());
                    }
                }

                _this3.scrollDetect.lastScrollTop = _this3.content.scrollTop;
                _this3.scrollDetect.lastScrollLeft = _this3.content.scrollLeft;
            }, this.props.scrollDetectionThreshold);
        }
    }, {
        key: "handleWindowResizeEvent",
        value: function handleWindowResizeEvent() {
            this.update();
        }
    }, {
        key: "handleTrackVerticalMousedownEvent",
        value: function handleTrackVerticalMousedownEvent(e) {
            if (e.which !== 1) {
                return;
            }
            e.preventDefault();

            var offset = Math.abs(e.target.getBoundingClientRect().top - e.clientY) - this.thumbVertical.clientHeight / 2;

            this.content.scrollTop = this.computeScrollTopForThumbOffset(offset);
        }
    }, {
        key: "handleTrackHorizontalMousedownEvent",
        value: function handleTrackHorizontalMousedownEvent(e) {
            if (e.which !== 1) {
                return;
            }
            e.preventDefault();

            var offset = Math.abs(e.target.getBoundingClientRect().left - e.clientX) - this.thumbHorizontal.clientWidth / 2;

            this.content.scrollLeft = this.computeScrollLeftForThumbOffset(offset);
        }
    }, {
        key: "handleThumbVerticalMousedownEvent",
        value: function handleThumbVerticalMousedownEvent(e) {
            if (e.which !== 1) {
                return;
            }
            e.preventDefault();
            e.stopImmediatePropagation();

            this.handleDragStart();

            var target = e.target,
                clientY = e.clientY;

            this.dragPrevPageY = target.clientHeight - (clientY - target.getBoundingClientRect().top);
            this.thumbVertical.classList.add("dragging");
        }
    }, {
        key: "handleThumbHorizontalMousedownEvent",
        value: function handleThumbHorizontalMousedownEvent(e) {
            if (e.which !== 1) {
                return;
            }
            e.preventDefault();
            e.stopImmediatePropagation();

            this.handleDragStart();

            var target = e.target,
                clientX = e.clientX;

            this.dragPrevPageX = target.clientWidth - (clientX - target.getBoundingClientRect().left);
            this.thumbHorizontal.classList.add("dragging");
        }
    }, {
        key: "handleDragStart",
        value: function handleDragStart() {
            this.drag = true;
            this.scrollDetect();

            document.addEventListener("mousemove", this.handleDragEvent);
            document.addEventListener("mouseup", this.handleDragEnd);

            document.body.style.userSelect = "none";
            document.onselectstart = function () {
                return false;
            };
        }
    }, {
        key: "handleDragEnd",
        value: function handleDragEnd() {
            this.drag = false;
            this.dragPrevPageX = this.dragPrevPageY = 0;

            document.removeEventListener("mousemove", this.handleDragEvent);
            document.removeEventListener("mouseup", this.handleDragEnd);

            document.body.style.userSelect = null;
            delete document.onselectstart;

            this.thumbHorizontal.classList.remove("dragging");
            this.thumbVertical.classList.remove("dragging");
        }
    }, {
        key: "handleDragEvent",
        value: function handleDragEvent(e) {
            if (this.dragPrevPageX) {
                var offset = -this.trackHorizontal.getBoundingClientRect().left + e.clientX - (this.thumbHorizontal.clientWidth - this.dragPrevPageX);
                this.content.scrollLeft = this.computeScrollLeftForThumbOffset(offset);
            }
            if (this.dragPrevPageY) {
                var _offset = -this.trackVertical.getBoundingClientRect().top + e.clientY - (this.thumbVertical.clientHeight - this.dragPrevPageY);
                this.content.scrollTop = this.computeScrollTopForThumbOffset(_offset);
            }
        }

        //================//
        //   assistance   //
        //================//
        /**
         * Request animation frame and call given function inside
         *
         * @param cb {function|undefined} Function to call in requested frame
         * @return {Scrollbar}
         */

    }, {
        key: "raf",
        value: function raf() {
            var _this4 = this;

            var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

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
        value: function update() {
            var _this5 = this;

            var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

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
        value: function actualizeScrollbars() {
            var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

            var scrollValues = this.getScrollValues();
            var scrollLeft = scrollValues.scrollLeft,
                scrollTop = scrollValues.scrollTop,
                clientWidth = scrollValues.clientWidth,
                scrollWidth = scrollValues.scrollWidth,
                clientHeight = scrollValues.clientHeight,
                scrollHeight = scrollValues.scrollHeight;


            var verticalScrollPossible = scrollHeight <= clientHeight && !this.props.noScroll && this.props.scrollY,
                horizontalScrollPossible = scrollWidth <= clientWidth && !this.props.noScroll && this.props.scrollX;

            var oldVerticalTrackDisplay = this.trackVertical.style.display,
                oldHorizontalTrackDisplay = this.trackHorizontal.style.display;

            if (this.trackVertical.style.display === 'none' && verticalScrollPossible) {
                this.trackVertical.style.display = null;
                this.trackVertical.visibility = 'hidden';
            }
            if (this.trackHorizontal.style.display === 'none' && horizontalScrollPossible) {
                this.trackHorizontal.style.display = null;
                this.trackHorizontal.visibility = 'hidden';
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

            var _props2 = this.props,
                style = _props2.style,
                thumbSizeMin = _props2.thumbSizeMin,
                defaultStyles = _props2.defaultStyles,
                scrollDetectionThreshold = _props2.scrollDetectionThreshold,
                permanentScrollbars = _props2.permanentScrollbars,
                permanentScrollbarVertical = _props2.permanentScrollbarVertical,
                permanentScrollbarHorizontal = _props2.permanentScrollbarHorizontal,
                contentSizeTrack = _props2.contentSizeTrack,
                contentSizeTrackInterval = _props2.contentSizeTrackInterval,
                noScroll = _props2.noScroll,
                scrollX = _props2.scrollX,
                scrollY = _props2.scrollY,
                gridless = _props2.gridless,
                tagName = _props2.tagName,
                className = _props2.className,
                children = _props2.children,
                renderWrapper = _props2.renderWrapper,
                renderContent = _props2.renderContent,
                renderTrackVertical = _props2.renderTrackVertical,
                renderTrackHorizontal = _props2.renderTrackHorizontal,
                renderThumbVertical = _props2.renderThumbVertical,
                renderThumbHorizontal = _props2.renderThumbHorizontal,
                onUpdate = _props2.onUpdate,
                onScroll = _props2.onScroll,
                onScrollStart = _props2.onScrollStart,
                onScrollStop = _props2.onScrollStop,
                props = _objectWithoutProperties(_props2, ["style", "thumbSizeMin", "defaultStyles", "scrollDetectionThreshold", "permanentScrollbars", "permanentScrollbarVertical", "permanentScrollbarHorizontal", "contentSizeTrack", "contentSizeTrackInterval", "noScroll", "scrollX", "scrollY", "gridless", "tagName", "className", "children", "renderWrapper", "renderContent", "renderTrackVertical", "renderTrackHorizontal", "renderThumbVertical", "renderThumbHorizontal", "onUpdate", "onScroll", "onScrollStart", "onScrollStop"]);

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