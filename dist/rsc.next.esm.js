import { cnb } from 'cnbuilder';
import * as React from 'react';
import { zoomLevel } from 'zoom-level';
import { DraggableCore } from 'react-draggable';

let doc = typeof document === "object" ? document : null;
const isUndef = (v) => {
    return typeof v === "undefined";
};
const isFun = (v) => {
    return typeof v === "function";
};
const isNum = (v) => {
    return typeof v === "number";
};
/**
 * @description Will return renderer result if presented, div element otherwise.
 * If renderer is presented it'll receive `elementRef` function which should be used as HTMLElement's ref.
 *
 * @param props {ElementPropsWithElementRefAndRenderer}
 * @param elementRef {ElementRef}
 */
const renderDivWithRenderer = (props, elementRef) => {
    if (isFun(props.renderer)) {
        props.elementRef = elementRef;
        const renderer = props.renderer;
        delete props.renderer;
        return renderer(props);
    }
    delete props.elementRef;
    return React.createElement("div", Object.assign({}, props, { ref: elementRef }));
};
const getInnerSize = (el, dimension, padding1, padding2) => {
    const styles = getComputedStyle(el);
    if (styles.boxSizing === "border-box") {
        return Math.max(0, (parseFloat(styles[dimension]) || 0) -
            (parseFloat(styles[padding1]) || 0) -
            (parseFloat(styles[padding2]) || 0));
    }
    return parseFloat(styles[dimension]) || 0;
};
/**
 * @description Return element's height without padding
 */
const getInnerHeight = (el) => {
    return getInnerSize(el, "height", "paddingTop", "paddingBottom");
};
/**
 * @description Return element's width without padding
 */
const getInnerWidth = (el) => {
    return getInnerSize(el, "width", "paddingLeft", "paddingRight");
};
/**
 * @description Return unique UUID v4
 */
const uuid = () => {
    let uuid = "";
    for (let i = 0; i < 32; i++) {
        if (i === 8 || i === 20) {
            uuid += "-" + ((Math.random() * 16) | 0).toString(16);
        }
        else if (i === 12) {
            uuid += "-4";
        }
        else if (i === 16) {
            uuid += "-" + ((Math.random() * 16) | (0 & 3) | 8).toString(16);
        }
        else {
            uuid += ((Math.random() * 16) | 0).toString(16);
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
const calcThumbSize = (contentSize, viewportSize, trackSize, minimalSize, maximalSize) => {
    if (viewportSize >= contentSize) {
        return 0;
    }
    let thumbSize = (viewportSize / contentSize) * trackSize;
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
const calcThumbOffset = (contentSize, viewportSize, trackSize, thumbSize, scroll) => {
    if (!scroll || !thumbSize || viewportSize >= contentSize) {
        return 0;
    }
    return ((trackSize - thumbSize) * scroll) / (contentSize - viewportSize);
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
const calcScrollForThumbOffset = (contentSize, viewportSize, trackSize, thumbSize, thumbOffset) => {
    if (!thumbOffset || !thumbSize || viewportSize >= contentSize) {
        return 0;
    }
    return (thumbOffset * (contentSize - viewportSize)) / (trackSize - thumbSize);
};
/**
 * @description Returns scrollbar width specific for current environment. Can return undefined if DOM is not ready yet.
 */
const getScrollbarWidth = (force = false) => {
    if (!doc) {
        return (getScrollbarWidth._cache = 0);
    }
    if (!force && !isUndef(getScrollbarWidth._cache)) {
        return getScrollbarWidth._cache;
    }
    let el = doc.createElement("div");
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
const shouldReverseRtlScroll = (force = false) => {
    if (!force && !isUndef(shouldReverseRtlScroll._cache)) {
        return shouldReverseRtlScroll._cache;
    }
    if (!doc) {
        return (shouldReverseRtlScroll._cache = false);
    }
    const el = doc.createElement("div");
    const child = doc.createElement("div");
    el.appendChild(child);
    el.setAttribute("style", "position:absolute;width:100px;height:100px;top:-999px;left:-999px;overflow:scroll;direction:rtl");
    child.setAttribute("style", "width:1000px;height:1000px");
    doc.body.appendChild(el);
    el.scrollLeft = -50;
    shouldReverseRtlScroll._cache = el.scrollLeft === -50;
    doc.body.removeChild(el);
    return shouldReverseRtlScroll._cache;
};

class Emittr {
    constructor(maxHandlers = 10) {
        this.setMaxHandlers(maxHandlers);
        this._handlers = Object.create(null);
    }
    static _callEventHandlers(emitter, handlers, args) {
        if (!handlers.length) {
            return;
        }
        if (handlers.length === 1) {
            Reflect.apply(handlers[0], emitter, args);
            return;
        }
        handlers = [...handlers];
        let idx;
        for (idx = 0; idx < handlers.length; idx++) {
            Reflect.apply(handlers[idx], emitter, args);
        }
    }
    setMaxHandlers(count) {
        if (!isNum(count) || count <= 0) {
            throw new TypeError(`Expected maxHandlers to be a positive number, got '${count}' of type ${typeof count}`);
        }
        this._maxHandlers = count;
        return this;
    }
    getMaxHandlers() {
        return this._maxHandlers;
    }
    emit(name, ...args) {
        if (typeof this._handlers[name] !== "object" || !Array.isArray(this._handlers[name])) {
            return false;
        }
        Emittr._callEventHandlers(this, this._handlers[name], args);
        return true;
    }
    on(name, handler) {
        Emittr._addHandler(this, name, handler);
        return this;
    }
    prependOn(name, handler) {
        Emittr._addHandler(this, name, handler, true);
        return this;
    }
    once(name, handler) {
        if (!isFun(handler)) {
            throw new TypeError("Expected event handler to be a function, got " + typeof handler);
        }
        Emittr._addHandler(this, name, this._wrapOnceHandler(name, handler));
        return this;
    }
    prependOnce(name, handler) {
        if (!isFun(handler)) {
            throw new TypeError("Expected event handler to be a function, got " + typeof handler);
        }
        Emittr._addHandler(this, name, this._wrapOnceHandler(name, handler), true);
        return this;
    }
    off(name, handler) {
        Emittr._removeHandler(this, name, handler);
        return this;
    }
    removeAllHandlers() {
        const handlers = this._handlers;
        this._handlers = Object.create(null);
        const removeHandlers = handlers["removeHandler"];
        delete handlers["removeHandler"];
        let idx, eventName;
        for (eventName in handlers) {
            for (idx = handlers[eventName].length - 1; idx >= 0; idx--) {
                Emittr._callEventHandlers(this, removeHandlers, [
                    eventName,
                    handlers[eventName][idx].handler || handlers[eventName][idx],
                ]);
            }
        }
        return this;
    }
    _wrapOnceHandler(name, handler) {
        const onceState = {
            fired: false,
            handler,
            wrappedHandler: undefined,
            emitter: this,
            event: name,
        };
        const wrappedHandler = Emittr._onceWrapper.bind(onceState);
        onceState.wrappedHandler = wrappedHandler;
        wrappedHandler.handler = handler;
        wrappedHandler.event = name;
        return wrappedHandler;
    }
}
Emittr._addHandler = (emitter, name, handler, prepend = false) => {
    if (!isFun(handler)) {
        throw new TypeError("Expected event handler to be a function, got " + typeof handler);
    }
    emitter._handlers[name] = emitter._handlers[name] || [];
    emitter.emit("addHandler", name, handler);
    prepend ? emitter._handlers[name].unshift(handler) : emitter._handlers[name].push(handler);
    return emitter;
};
Emittr._onceWrapper = function _onceWrapper(...args) {
    if (!this.fired) {
        this.fired = true;
        this.emitter.off(this.event, this.wrappedHandler);
        Reflect.apply(this.handler, this.emitter, args);
    }
};
Emittr._removeHandler = (emitter, name, handler) => {
    if (!isFun(handler)) {
        throw new TypeError("Expected event handler to be a function, got " + typeof handler);
    }
    if (isUndef(emitter._handlers[name]) || !emitter._handlers[name].length) {
        return emitter;
    }
    let idx = -1;
    if (emitter._handlers[name].length === 1) {
        if (emitter._handlers[name][0] === handler || emitter._handlers[name][0].handler === handler) {
            idx = 0;
            handler = emitter._handlers[name][0].handler || emitter._handlers[name][0];
        }
    }
    else {
        for (idx = emitter._handlers[name].length - 1; idx >= 0; idx--) {
            if (emitter._handlers[name][idx] === handler ||
                emitter._handlers[name][idx].handler === handler) {
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

class RAFLoop {
    constructor() {
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
        this.start = () => {
            if (!this._isActive && this.targets.length) {
                this._isActive = true;
                this.animationFrameID && cancelAnimationFrame(this.animationFrameID);
                this.animationFrameID = requestAnimationFrame(this.rafCallback);
            }
            return this;
        };
        /**
         * @description Stop the loop if is was active.
         */
        this.stop = () => {
            if (this._isActive) {
                this._isActive = false;
                this.animationFrameID && cancelAnimationFrame(this.animationFrameID);
                this.animationFrameID = 0;
            }
            return this;
        };
        /**
         * @description Add target to the iteration list if it's not there.
         */
        this.addTarget = (target, silent = false) => {
            if (this.targets.indexOf(target) === -1) {
                this.targets.push(target);
                this.targets.length === 1 && !silent && this.start();
            }
            return this;
        };
        /**
         * @description Remove target from iteration list if it was there.
         */
        this.removeTarget = (target) => {
            const idx = this.targets.indexOf(target);
            if (idx !== -1) {
                this.targets.splice(idx, 1);
                this.targets.length === 0 && this.stop();
            }
            return this;
        };
        /**
         * @description Callback that called each animation frame.
         */
        this.rafCallback = () => {
            if (!this._isActive) {
                return 0;
            }
            for (let i = 0; i < this.targets.length; i++) {
                !this.targets[i]._unmounted && this.targets[i].update();
            }
            return (this.animationFrameID = requestAnimationFrame(this.rafCallback));
        };
    }
    /**
     * @description Loop's state.
     */
    get isActive() {
        return this._isActive;
    }
}
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

class ScrollbarThumb extends React.Component {
    constructor() {
        super(...arguments);
        this.initialOffsetX = 0;
        this.initialOffsetY = 0;
        this.lastDragData = {
            x: 0,
            y: 0,
            deltaX: 0,
            deltaY: 0,
            lastX: 0,
            lastY: 0,
        };
        this.element = null;
        this.elementRefHack = React.createRef();
        this.handleOnDragStart = (ev, data) => {
            if (!this.element) {
                this.handleOnDragStop(ev, data);
                return;
            }
            if (global.document) {
                this.prevUserSelect = global.document.body.style.userSelect;
                global.document.body.style.userSelect = "none";
                this.prevOnSelectStart = global.document.onselectstart;
                global.document.onselectstart = ScrollbarThumb.selectStartReplacer;
            }
            this.props.onDragStart &&
                this.props.onDragStart((this.lastDragData = {
                    x: data.x - this.initialOffsetX,
                    y: data.y - this.initialOffsetY,
                    lastX: data.lastX - this.initialOffsetX,
                    lastY: data.lastY - this.initialOffsetY,
                    deltaX: data.deltaX,
                    deltaY: data.deltaY,
                }));
            this.element.classList.add("dragging");
        };
        this.handleOnDrag = (ev, data) => {
            if (!this.element) {
                this.handleOnDragStop(ev, data);
                return;
            }
            this.props.onDrag &&
                this.props.onDrag((this.lastDragData = {
                    x: data.x - this.initialOffsetX,
                    y: data.y - this.initialOffsetY,
                    lastX: data.lastX - this.initialOffsetX,
                    lastY: data.lastY - this.initialOffsetY,
                    deltaX: data.deltaX,
                    deltaY: data.deltaY,
                }));
        };
        this.handleOnDragStop = (ev, data) => {
            const resultData = data
                ? {
                    x: data.x - this.initialOffsetX,
                    y: data.y - this.initialOffsetY,
                    lastX: data.lastX - this.initialOffsetX,
                    lastY: data.lastY - this.initialOffsetY,
                    deltaX: data.deltaX,
                    deltaY: data.deltaY,
                }
                : this.lastDragData;
            this.props.onDragEnd && this.props.onDragEnd(resultData);
            this.element && this.element.classList.remove("dragging");
            if (global.document) {
                global.document.body.style.userSelect = this.prevUserSelect;
                global.document.onselectstart = this.prevOnSelectStart;
                this.prevOnSelectStart = null;
            }
            this.initialOffsetX = 0;
            this.initialOffsetY = 0;
            this.lastDragData = {
                x: 0,
                y: 0,
                deltaX: 0,
                deltaY: 0,
                lastX: 0,
                lastY: 0,
            };
        };
        this.handleOnMouseDown = (ev) => {
            if (!this.element) {
                return;
            }
            ev.preventDefault();
            ev.stopPropagation();
            if (!isUndef(ev.offsetX)) {
                /* istanbul ignore next */
                this.initialOffsetX = ev.offsetX;
                /* istanbul ignore next */
                this.initialOffsetY = ev.offsetY;
            }
            else {
                const rect = this.element.getBoundingClientRect();
                this.initialOffsetX = (ev.clientX || ev.touches[0].clientX) - rect.left;
                this.initialOffsetY = (ev.clientY || ev.touches[0].clientY) - rect.top;
            }
        };
        this.elementRef = (ref) => {
            isFun(this.props.elementRef) && this.props.elementRef(ref);
            this.element = ref;
            // @ts-ignore
            this.elementRefHack["current"] = ref;
        };
    }
    componentDidMount() {
        if (!this.element) {
            this.setState(() => {
                throw new Error("<ScrollbarThumb> Element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function.");
            });
            return;
        }
    }
    componentWillUnmount() {
        this.handleOnDragStop();
        this.elementRef(null);
    }
    render() {
        const { elementRef, axis, onDrag, onDragEnd, onDragStart, ...props } = this.props;
        props.className = cnb("ScrollbarsCustom-Thumb", axis === AXIS_DIRECTION.X ? "ScrollbarsCustom-ThumbX" : "ScrollbarsCustom-ThumbY", props.className);
        if (props.renderer) {
            props.axis = axis;
        }
        return (React.createElement(DraggableCore, { allowAnyClick: false, enableUserSelectHack: false, onMouseDown: this.handleOnMouseDown, onDrag: this.handleOnDrag, onStart: this.handleOnDragStart, onStop: this.handleOnDragStop, 
            // ToDo: Fixit!
            // react-draggable developers did not update typings so there is no appropriate prop
            // @ts-ignore
            nodeRef: this.elementRefHack }, renderDivWithRenderer(props, this.elementRef)));
    }
}
ScrollbarThumb.selectStartReplacer = () => false;

class ScrollbarTrack extends React.Component {
    constructor() {
        super(...arguments);
        this.element = null;
        this.elementRef = (ref) => {
            isFun(this.props.elementRef) && this.props.elementRef(ref);
            this.element = ref;
        };
        this.handleClick = (ev) => {
            if (!ev || !this.element || ev.button !== 0) {
                return;
            }
            if (isFun(this.props.onClick) && ev.target === this.element) {
                if (!isUndef(ev.offsetX)) {
                    this.props.onClick(ev, {
                        axis: this.props.axis,
                        offset: this.props.axis === AXIS_DIRECTION.X ? ev.offsetX : ev.offsetY,
                    });
                }
                else {
                    // support for old browsers
                    /* istanbul ignore next */
                    const rect = this.element.getBoundingClientRect();
                    /* istanbul ignore next */
                    this.props.onClick(ev, {
                        axis: this.props.axis,
                        offset: this.props.axis === AXIS_DIRECTION.X
                            ? (ev.clientX || ev.touches[0].clientX) - rect.left
                            : (ev.clientY || ev.touches[0].clientY) - rect.top,
                    });
                }
            }
            return true;
        };
    }
    componentDidMount() {
        if (!this.element) {
            this.setState(() => {
                throw new Error("Element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function.");
            });
            return;
        }
        this.element.addEventListener("click", this.handleClick);
    }
    componentWillUnmount() {
        if (this.element) {
            this.element.removeEventListener("click", this.handleClick);
            this.element = null;
            this.elementRef(null);
        }
    }
    render() {
        const { elementRef, axis, onClick, ...props } = this.props;
        props.className = cnb("ScrollbarsCustom-Track", axis === AXIS_DIRECTION.X ? "ScrollbarsCustom-TrackX" : "ScrollbarsCustom-TrackY", props.className);
        if (props.renderer) {
            props.axis = axis;
        }
        return renderDivWithRenderer(props, this.elementRef);
    }
}

const style = {
    holder: {
        position: "relative",
        width: "100%",
        height: "100%",
    },
    wrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    content: {
        boxSizing: "border-box",
    },
    track: {
        common: {
            position: "absolute",
            overflow: "hidden",
            borderRadius: 4,
            background: "rgba(0,0,0,.1)",
            userSelect: "none",
        },
        x: {
            height: 10,
            width: "calc(100% - 20px)",
            bottom: 0,
            left: 10,
        },
        y: {
            width: 10,
            height: "calc(100% - 20px)",
            top: 10,
        },
    },
    thumb: {
        common: {
            cursor: "pointer",
            borderRadius: 4,
            background: "rgba(0,0,0,.4)",
        },
        x: {
            height: "100%",
            width: 0,
        },
        y: {
            width: "100%",
            height: 0,
        },
    },
};

let pageZoomLevel = global.window ? zoomLevel() : 1;
global.window && global.window.addEventListener("resize", () => (pageZoomLevel = zoomLevel()), { passive: true });
const ScrollbarContext = React.createContext({
    parentScrollbar: null,
});
class Scrollbar extends React.Component {
    constructor(props) {
        super(props);
        /**
         * @description Get current scroll-related values.<br/>
         * If <i>force</i> if truthy - will recalculate them instead of returning cached values.
         *
         * @return ScrollState
         */
        this.getScrollState = (force = false) => {
            if (this.scrollValues && !force) {
                return { ...this.scrollValues };
            }
            let scrollState = {
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
                isRTL: undefined,
            };
            const props = this.props;
            scrollState.isRTL = this.state.isRTL;
            scrollState.scrollYBlocked = props.noScroll || props.noScrollY;
            scrollState.scrollXBlocked = props.noScroll || props.noScrollX;
            if (this.scrollerElement) {
                scrollState.clientHeight = this.scrollerElement.clientHeight;
                scrollState.clientWidth = this.scrollerElement.clientWidth;
                scrollState.scrollHeight = this.scrollerElement.scrollHeight;
                scrollState.scrollWidth = this.scrollerElement.scrollWidth;
                scrollState.scrollTop = this.scrollerElement.scrollTop;
                scrollState.scrollLeft = this.scrollerElement.scrollLeft;
                scrollState.scrollYPossible = !scrollState.scrollYBlocked && scrollState.scrollHeight > scrollState.clientHeight;
                scrollState.scrollXPossible = !scrollState.scrollXBlocked && scrollState.scrollWidth > scrollState.clientWidth;
                scrollState.trackYVisible = scrollState.scrollYPossible || props.permanentTracks || props.permanentTrackY;
                scrollState.trackXVisible = scrollState.scrollXPossible || props.permanentTracks || props.permanentTrackX;
            }
            if (this.contentElement) {
                scrollState.contentScrollHeight = this.contentElement.scrollHeight;
                scrollState.contentScrollWidth = this.contentElement.scrollWidth;
            }
            return scrollState;
        };
        /**
         * @description Scroll to top border
         */
        this.scrollToTop = () => {
            if (this.scrollerElement) {
                this.scrollerElement.scrollTop = 0;
            }
            return this;
        };
        /**
         * @description Scroll to left border
         */
        this.scrollToLeft = () => {
            if (this.scrollerElement) {
                this.scrollerElement.scrollLeft = 0;
            }
            return this;
        };
        /**
         * @description Scroll to bottom border
         */
        this.scrollToBottom = () => {
            if (this.scrollerElement) {
                this.scrollerElement.scrollTop = this.scrollerElement.scrollHeight - this.scrollerElement.clientHeight;
            }
            return this;
        };
        /**
         * @description Scroll to right border
         */
        this.scrollToRight = () => {
            if (this.scrollerElement) {
                this.scrollerElement.scrollLeft = this.scrollerElement.scrollWidth - this.scrollerElement.clientWidth;
            }
            return this;
        };
        /**
         * @description Set the scrolls at given coordinates.<br/>
         * If coordinate is undefined - current scroll value will persist.
         */
        this.scrollTo = (x, y) => {
            if (this.scrollerElement) {
                isNum(x) && (this.scrollerElement.scrollLeft = x);
                isNum(y) && (this.scrollerElement.scrollTop = y);
            }
            return this;
        };
        /**
         * @description Center the viewport at given coordinates.<br/>
         * If coordinate is undefined - current scroll value will persist.
         */
        this.centerAt = (x, y) => {
            if (this.scrollerElement) {
                isNum(x) && (this.scrollerElement.scrollLeft = x - this.scrollerElement.clientWidth / 2);
                isNum(y) && (this.scrollerElement.scrollTop = y - this.scrollerElement.clientHeight / 2);
            }
            return this;
        };
        this.update = (force = false) => {
            if (!this.scrollerElement) {
                return;
            }
            // autodetect direction if not defined
            if (isUndef(this.state.isRTL)) {
                this.setState({
                    isRTL: getComputedStyle(this.scrollerElement).direction === "rtl",
                });
                return this.getScrollState();
            }
            const scrollState = this.getScrollState(true);
            const prevScrollState = { ...this.scrollValues };
            const props = this.props;
            let bitmask = 0;
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
                prevScrollState.zoomLevel !== scrollState.zoomLevel && (bitmask |= 1 << 15);
                // if not forced and nothing has changed - skip this update
                if (bitmask === 0) {
                    return prevScrollState;
                }
            }
            else {
                bitmask = 0b111111111111111;
            }
            if (!props.native && this.holderElement) {
                if (bitmask & (1 << 13) && (props.translateContentSizesToHolder || props.translateContentSizeYToHolder)) {
                    this.holderElement.style.height = scrollState.contentScrollHeight + "px";
                }
                if (bitmask & (1 << 14) && (props.translateContentSizesToHolder || props.translateContentSizeXToHolder)) {
                    this.holderElement.style.width = scrollState.contentScrollWidth + "px";
                }
                if (props.translateContentSizesToHolder ||
                    props.translateContentSizeYToHolder ||
                    props.translateContentSizeXToHolder) {
                    if ((!scrollState.clientHeight && scrollState.contentScrollHeight) ||
                        (!scrollState.clientWidth && scrollState.contentScrollWidth)) {
                        return;
                    }
                }
            }
            // if scrollbars visibility has changed
            if (bitmask & (1 << 10) || bitmask & (1 << 11)) {
                prevScrollState.scrollYBlocked = scrollState.scrollYBlocked;
                prevScrollState.scrollXBlocked = scrollState.scrollXBlocked;
                prevScrollState.scrollYPossible = scrollState.scrollYPossible;
                prevScrollState.scrollXPossible = scrollState.scrollXPossible;
                if (this.trackYElement && bitmask & (1 << 10)) {
                    this.trackYElement.style.display = scrollState.trackYVisible ? "" : "none";
                }
                if (this.trackXElement && bitmask & (1 << 11)) {
                    this.trackXElement.style.display = scrollState.trackXVisible ? "" : "none";
                }
                this.scrollValues = prevScrollState;
                this.setState({
                    trackYVisible: (this.scrollValues.trackYVisible = scrollState.trackYVisible),
                    trackXVisible: (this.scrollValues.trackXVisible = scrollState.trackXVisible),
                });
                return;
            }
            (props.native ? this.updaterNative : this.updaterCustom)(bitmask, scrollState);
            this.scrollValues = scrollState;
            if (!props.native && bitmask & (1 << 15)) {
                getScrollbarWidth(true);
                this.forceUpdate();
            }
            this.eventEmitter.emit("update", { ...scrollState }, prevScrollState);
            (bitmask & (1 << 4) || bitmask & (1 << 5)) && this.eventEmitter.emit("scroll", { ...scrollState }, prevScrollState);
            return this.scrollValues;
        };
        this.updaterNative = () => {
            // just for future
            return true;
        };
        this.updaterCustom = (bitmask, scrollValues) => {
            const props = this.props;
            if (this.trackYElement) {
                if (this.thumbYElement &&
                    (bitmask & (1 << 0) || bitmask & (1 << 2) || bitmask & (1 << 4) || bitmask & (1 << 6) || bitmask & (1 << 8))) {
                    if (scrollValues.scrollYPossible) {
                        const trackInnerSize = getInnerHeight(this.trackYElement);
                        const thumbSize = calcThumbSize(scrollValues.scrollHeight, scrollValues.clientHeight, trackInnerSize, props.minimalThumbYSize || props.minimalThumbSize, props.maximalThumbYSize || props.maximalThumbSize);
                        const thumbOffset = calcThumbOffset(scrollValues.scrollHeight, scrollValues.clientHeight, trackInnerSize, thumbSize, scrollValues.scrollTop);
                        this.thumbYElement.style.transform = `translateY(${thumbOffset}px)`;
                        this.thumbYElement.style.height = thumbSize + "px";
                        this.thumbYElement.style.display = "";
                    }
                    else {
                        this.thumbYElement.style.transform = "";
                        this.thumbYElement.style.height = "0px";
                        this.thumbYElement.style.display = "none";
                    }
                }
            }
            if (this.trackXElement) {
                if (this.thumbXElement &&
                    (bitmask & (1 << 1) ||
                        bitmask & (1 << 3) ||
                        bitmask & (1 << 5) ||
                        bitmask & (1 << 7) ||
                        bitmask & (1 << 9) ||
                        bitmask & (1 << 12))) {
                    if (scrollValues.scrollXPossible) {
                        const trackInnerSize = getInnerWidth(this.trackXElement);
                        const thumbSize = calcThumbSize(scrollValues.scrollWidth, scrollValues.clientWidth, trackInnerSize, props.minimalThumbXSize || props.minimalThumbSize, props.maximalThumbXSize || props.maximalThumbSize);
                        let thumbOffset = calcThumbOffset(scrollValues.scrollWidth, scrollValues.clientWidth, trackInnerSize, thumbSize, scrollValues.scrollLeft);
                        if (this.state.isRTL && shouldReverseRtlScroll()) {
                            thumbOffset += trackInnerSize - thumbSize;
                        }
                        this.thumbXElement.style.transform = `translateX(${thumbOffset}px)`;
                        this.thumbXElement.style.width = thumbSize + "px";
                        this.thumbXElement.style.display = "";
                    }
                    else {
                        this.thumbXElement.style.transform = "";
                        this.thumbXElement.style.width = "0px";
                        this.thumbXElement.style.display = "none";
                    }
                }
            }
            return true;
        };
        this.elementRefHolder = (ref) => {
            this.holderElement = ref;
            isFun(this.props.elementRef) && this.props.elementRef(ref);
        };
        this.elementRefWrapper = (ref) => {
            this.wrapperElement = ref;
            isFun(this.props.wrapperProps.elementRef) && this.props.wrapperProps.elementRef(ref);
        };
        this.elementRefScroller = (ref) => {
            this.scrollerElement = ref;
            isFun(this.props.scrollerProps.elementRef) && this.props.scrollerProps.elementRef(ref);
        };
        this.elementRefContent = (ref) => {
            this.contentElement = ref;
            isFun(this.props.contentProps.elementRef) && this.props.contentProps.elementRef(ref);
        };
        this.elementRefTrackX = (ref) => {
            this.trackXElement = ref;
            isFun(this.props.trackXProps.elementRef) && this.props.trackXProps.elementRef(ref);
        };
        this.elementRefTrackY = (ref) => {
            this.trackYElement = ref;
            isFun(this.props.trackYProps.elementRef) && this.props.trackYProps.elementRef(ref);
        };
        this.elementRefThumbX = (ref) => {
            this.thumbXElement = ref;
            isFun(this.props.thumbXProps.elementRef) && this.props.thumbXProps.elementRef(ref);
        };
        this.elementRefThumbY = (ref) => {
            this.thumbYElement = ref;
            isFun(this.props.thumbYProps.elementRef) && this.props.thumbYProps.elementRef(ref);
        };
        this.handleTrackXClick = (ev, values) => {
            this.props.trackXProps.onClick && this.props.trackXProps.onClick(ev, values);
            if (!this.scrollerElement ||
                !this.trackXElement ||
                !this.thumbXElement ||
                !this.scrollValues ||
                !this.scrollValues.scrollXPossible) {
                return;
            }
            this._scrollDetection();
            const thumbSize = this.thumbXElement.clientWidth;
            const trackInnerSize = getInnerWidth(this.trackXElement);
            const thumbOffset = (this.scrollValues.isRTL && shouldReverseRtlScroll()
                ? values.offset + thumbSize / 2 - trackInnerSize
                : values.offset - thumbSize / 2) -
                //@ts-ignore
                (parseFloat(getComputedStyle(this.trackXElement).paddingLeft) || 0);
            let target = calcScrollForThumbOffset(this.scrollValues.scrollWidth, this.scrollValues.clientWidth, trackInnerSize, thumbSize, thumbOffset);
            if (this.props.trackClickBehavior === TRACK_CLICK_BEHAVIOR.STEP) {
                target = (this.scrollValues.isRTL ? this.scrollValues.scrollLeft > target : this.scrollValues.scrollLeft < target)
                    ? this.scrollValues.scrollLeft + this.scrollValues.clientWidth
                    : this.scrollValues.scrollLeft - this.scrollValues.clientWidth;
            }
            this.scrollerElement.scrollLeft = target;
        };
        this.handleTrackYClick = (ev, values) => {
            this.props.trackYProps.onClick && this.props.trackYProps.onClick(ev, values);
            if (!this.scrollerElement ||
                !this.trackYElement ||
                !this.thumbYElement ||
                !this.scrollValues ||
                !this.scrollValues.scrollYPossible) {
                return;
            }
            this._scrollDetection();
            const thumbSize = this.thumbYElement.clientHeight;
            let target = calcScrollForThumbOffset(this.scrollValues.scrollHeight, this.scrollValues.clientHeight, getInnerHeight(this.trackYElement), thumbSize, values.offset - thumbSize / 2) -
                //@ts-ignore
                (parseFloat(getComputedStyle(this.trackYElement).paddingTop) || 0);
            if (this.props.trackClickBehavior === TRACK_CLICK_BEHAVIOR.JUMP) {
                this.scrollerElement.scrollTop = target;
            }
            else {
                this.scrollerElement.scrollTop =
                    this.scrollValues.scrollTop < target
                        ? this.scrollValues.scrollTop + this.scrollValues.clientHeight
                        : this.scrollValues.scrollTop - this.scrollValues.clientHeight;
            }
        };
        this.handleTrackYMouseWheel = (ev) => {
            const props = this.props;
            props.trackYProps && props.trackYProps.onWheel && props.trackYProps.onWheel(ev);
            if (props.disableTracksMousewheelScrolling || props.disableTrackYMousewheelScrolling) {
                return;
            }
            this._scrollDetection();
            if (!this.scrollerElement || this.scrollValues.scrollYBlocked) {
                return;
            }
            this.scrollTop += ev.deltaY;
        };
        this.handleTrackXMouseWheel = (ev) => {
            const props = this.props;
            props.trackXProps && props.trackXProps.onWheel && props.trackXProps.onWheel(ev);
            if (props.disableTracksMousewheelScrolling || props.disableTrackXMousewheelScrolling) {
                return;
            }
            this._scrollDetection();
            if (!this.scrollerElement || this.scrollValues.scrollXBlocked) {
                return;
            }
            this.scrollLeft += ev.deltaX;
        };
        this.handleThumbXDrag = (data) => {
            var _a;
            if (!this.trackXElement ||
                !this.thumbXElement ||
                !this.scrollerElement ||
                !this.scrollValues ||
                !this.scrollValues.scrollXPossible) {
                return;
            }
            this._scrollDetection();
            const trackRect = this.trackXElement.getBoundingClientRect();
            const styles = getComputedStyle(this.trackXElement);
            const paddingLeft = parseFloat(styles.paddingLeft) || 0;
            const paddingRight = parseFloat(styles.paddingRight) || 0;
            const trackInnerSize = trackRect.width - paddingLeft - paddingRight;
            const thumbSize = this.thumbXElement.clientWidth;
            const offset = this.scrollValues.isRTL && shouldReverseRtlScroll()
                ? data.x + thumbSize - trackInnerSize + paddingLeft
                : data.lastX - paddingLeft;
            this.scrollerElement.scrollLeft = calcScrollForThumbOffset(this.scrollValues.scrollWidth, this.scrollValues.clientWidth, trackInnerSize, thumbSize, offset);
            if ((_a = this.props.thumbXProps) === null || _a === void 0 ? void 0 : _a.onDrag) {
                this.props.thumbXProps.onDrag(data);
            }
        };
        this.handleThumbXDragEnd = (data) => {
            var _a;
            this.handleThumbXDrag(data);
            if ((_a = this.props.thumbXProps) === null || _a === void 0 ? void 0 : _a.onDragEnd) {
                this.props.thumbXProps.onDragEnd(data);
            }
        };
        this.handleThumbYDrag = (data) => {
            var _a;
            if (!this.scrollerElement ||
                !this.trackYElement ||
                !this.thumbYElement ||
                !this.scrollValues ||
                !this.scrollValues.scrollYPossible) {
                return;
            }
            this._scrollDetection();
            const trackRect = this.trackYElement.getBoundingClientRect();
            const styles = getComputedStyle(this.trackYElement);
            const paddingTop = parseFloat(styles.paddingTop) || 0;
            const paddingBottom = parseFloat(styles.paddingBottom) || 0;
            const trackInnerSize = trackRect.height - paddingTop - paddingBottom;
            const thumbSize = this.thumbYElement.clientHeight;
            const offset = data.y - paddingTop;
            this.scrollerElement.scrollTop = calcScrollForThumbOffset(this.scrollValues.scrollHeight, this.scrollValues.clientHeight, trackInnerSize, thumbSize, offset);
            if ((_a = this.props.thumbYProps) === null || _a === void 0 ? void 0 : _a.onDrag) {
                this.props.thumbYProps.onDrag(data);
            }
        };
        this.handleThumbYDragEnd = (data) => {
            var _a;
            this.handleThumbYDrag(data);
            if ((_a = this.props.thumbYProps) === null || _a === void 0 ? void 0 : _a.onDragEnd) {
                this.props.thumbYProps.onDragEnd(data);
            }
        };
        this.handleScrollerScroll = () => {
            this._scrollDetection();
        };
        this._scrollDetection = () => {
            !this._scrollDetectionTO && this.eventEmitter.emit("scrollStart", this.getScrollState());
            this._scrollDetectionTO && global.window && global.window.clearTimeout(this._scrollDetectionTO);
            this._scrollDetectionTO = global.window
                ? global.window.setTimeout(this._scrollDetectionCallback, this.props.scrollDetectionThreshold || 0)
                : null;
        };
        this._scrollDetectionCallback = () => {
            this._scrollDetectionTO = null;
            this.eventEmitter.emit("scrollStop", this.getScrollState());
        };
        this.state = {
            trackXVisible: false,
            trackYVisible: false,
            isRTL: props.rtl,
        };
        this.scrollValues = this.getScrollState(true);
        this.eventEmitter = new Emittr(15);
        props.onUpdate && this.eventEmitter.on("update", props.onUpdate);
        props.onScroll && this.eventEmitter.on("scroll", props.onScroll);
        props.onScrollStart && this.eventEmitter.on("scrollStart", props.onScrollStart);
        props.onScrollStop && this.eventEmitter.on("scrollStop", props.onScrollStop);
        this.id = uuid();
    }
    get scrollTop() {
        if (this.scrollerElement) {
            return this.scrollerElement.scrollTop;
        }
        return 0;
    }
    set scrollTop(top) {
        if (this.scrollerElement) {
            this.scrollerElement.scrollTop = top;
            this.update();
        }
    }
    get scrollLeft() {
        if (this.scrollerElement) {
            return this.scrollerElement.scrollLeft;
        }
        return 0;
    }
    set scrollLeft(left) {
        if (this.scrollerElement) {
            this.scrollerElement.scrollLeft = left;
        }
    }
    get scrollHeight() {
        if (this.scrollerElement) {
            return this.scrollerElement.scrollHeight;
        }
        return 0;
    }
    get scrollWidth() {
        if (this.scrollerElement) {
            return this.scrollerElement.scrollWidth;
        }
        return 0;
    }
    get clientHeight() {
        if (this.scrollerElement) {
            return this.scrollerElement.clientHeight;
        }
        return 0;
    }
    get clientWidth() {
        if (this.scrollerElement) {
            return this.scrollerElement.clientWidth;
        }
        return 0;
    }
    static calculateStyles(props, state, scrollValues, scrollbarWidth) {
        const useDefaultStyles = !props.noDefaultStyles;
        return {
            holder: {
                ...(useDefaultStyles && style.holder),
                position: "relative",
                ...props.style,
            },
            wrapper: {
                ...(useDefaultStyles && {
                    ...style.wrapper,
                    ...(!props.disableTracksWidthCompensation &&
                        !props.disableTrackYWidthCompensation && {
                        [state.isRTL ? "left" : "right"]: state.trackYVisible ? 10 : 0,
                    }),
                    ...(!props.disableTracksWidthCompensation &&
                        !props.disableTrackXWidthCompensation && {
                        bottom: state.trackXVisible ? 10 : 0,
                    }),
                }),
                ...props.wrapperProps.style,
                position: "absolute",
                overflow: "hidden",
            },
            content: {
                ...(useDefaultStyles && style.content),
                ...(props.translateContentSizesToHolder ||
                    props.translateContentSizeYToHolder ||
                    props.translateContentSizeXToHolder
                    ? {
                        display: "table-cell",
                    }
                    : {
                        padding: 0.05,
                    }),
                ...(useDefaultStyles &&
                    !(props.translateContentSizesToHolder || props.translateContentSizeYToHolder) && {
                    minHeight: "100%",
                }),
                ...(useDefaultStyles &&
                    !(props.translateContentSizesToHolder || props.translateContentSizeXToHolder) && {
                    minWidth: "100%",
                }),
                ...props.contentProps.style,
            },
            scroller: {
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                paddingBottom: !scrollbarWidth && scrollValues.scrollXPossible ? props.fallbackScrollbarWidth : undefined,
                [state.isRTL ? "paddingLeft" : "paddingRight"]: !scrollbarWidth && scrollValues.scrollYPossible ? props.fallbackScrollbarWidth : undefined,
                ...props.scrollerProps.style,
                ...(!isUndef(props.rtl) && {
                    direction: props.rtl ? "rtl" : "ltr",
                }),
                ...(props.momentum && { WebkitOverflowScrolling: "touch" }),
                overflowY: scrollValues.scrollYPossible ? "scroll" : "hidden",
                overflowX: scrollValues.scrollXPossible ? "scroll" : "hidden",
                marginBottom: scrollValues.scrollXPossible
                    ? -(scrollbarWidth || props.fallbackScrollbarWidth) - Number(scrollValues.zoomLevel !== 1)
                    : undefined,
                [state.isRTL ? "marginLeft" : "marginRight"]: scrollValues.scrollYPossible
                    ? -(scrollbarWidth || props.fallbackScrollbarWidth) - Number(scrollValues.zoomLevel !== 1)
                    : undefined,
            },
            trackX: {
                ...(useDefaultStyles && style.track.common),
                ...(useDefaultStyles && style.track.x),
                ...props.trackXProps.style,
                ...(!state.trackXVisible && { display: "none" }),
            },
            trackY: {
                ...(useDefaultStyles && style.track.common),
                ...(useDefaultStyles && style.track.y),
                ...(useDefaultStyles && { [state.isRTL ? "left" : "right"]: 0 }),
                ...props.trackYProps.style,
                ...(!state.trackYVisible && { display: "none" }),
            },
            thumbX: {
                ...(useDefaultStyles && style.thumb.common),
                ...(useDefaultStyles && style.thumb.x),
                ...props.thumbXProps.style,
            },
            thumbY: {
                ...(useDefaultStyles && style.thumb.common),
                ...(useDefaultStyles && style.thumb.y),
                ...props.thumbYProps.style,
            },
        };
    }
    componentDidMount() {
        if (!this.scrollerElement) {
            this.setState(() => {
                throw new Error("scroller element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function.");
            });
            return;
        }
        if (!this.contentElement) {
            this.setState(() => {
                throw new Error("content element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function.");
            });
            return;
        }
        const props = this.props;
        if (!props.native && !props.mobileNative) {
            //ToDo: move native state to the state so it can be synchronized
            if (!this.holderElement) {
                this.setState(() => {
                    throw new Error("holder element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function.");
                });
                return;
            }
            if (!this.wrapperElement) {
                this.setState(() => {
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
    }
    componentWillUnmount() {
        Loop.removeTarget(this);
    }
    componentDidUpdate(prevProps, prevState) {
        if (!this.scrollerElement) {
            return;
        }
        const props = this.props;
        if (props.rtl !== prevProps.rtl && props.rtl !== this.state.isRTL) {
            this.setState({ isRTL: props.rtl });
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
    }
    render() {
        const { createContext, rtl, native, mobileNative, momentum, noDefaultStyles, disableTracksMousewheelScrolling, disableTrackXMousewheelScrolling, disableTrackYMousewheelScrolling, disableTracksWidthCompensation, disableTrackXWidthCompensation, disableTrackYWidthCompensation, noScrollX, noScrollY, noScroll, permanentTrackX, permanentTrackY, permanentTracks, removeTracksWhenNotUsed, removeTrackYWhenNotUsed, removeTrackXWhenNotUsed, minimalThumbSize, maximalThumbSize, minimalThumbXSize, maximalThumbXSize, minimalThumbYSize, maximalThumbYSize, fallbackScrollbarWidth, scrollTop, scrollLeft, trackClickBehavior, scrollDetectionThreshold, wrapperProps: propsWrapperProps, scrollerProps: propsScrollerProps, contentProps: propsContentProps, trackXProps: propsTrackXProps, trackYProps: propsTrackYProps, thumbXProps: propsThumbXProps, thumbYProps: propsThumbYProps, scrollbarWidth: propsScrollbarWidth, elementRef, onUpdate, onScroll, onScrollStart, onScrollStop, translateContentSizesToHolder, translateContentSizeYToHolder, translateContentSizeXToHolder, children, ...propsHolderProps } = this.props;
        const scrollbarWidth = !isUndef(propsScrollbarWidth) ? propsScrollbarWidth : getScrollbarWidth() || 0;
        if (native || (!scrollbarWidth && mobileNative)) {
            this.elementRefHolder(null);
            this.elementRefWrapper(null);
            this.elementRefTrackX(null);
            this.elementRefTrackY(null);
            this.elementRefThumbX(null);
            this.elementRefThumbY(null);
            const contentProps = {
                ...propsContentProps,
                key: "ScrollbarsCustom-Content",
                className: cnb("ScrollbarsCustom-Content", propsContentProps.className),
                children,
            };
            const scrollerProps = {
                ...propsHolderProps,
                className: cnb("ScrollbarsCustom native", this.state.trackYVisible && "trackYVisible", this.state.trackXVisible && "trackXVisible", this.state.isRTL && "rtl", propsHolderProps.className),
                style: {
                    ...propsHolderProps.style,
                    ...(!isUndef(rtl) && {
                        direction: rtl ? "rtl" : "ltr",
                    }),
                    ...(momentum && { WebkitOverflowScrolling: "touch" }),
                    overflowX: noScroll || noScrollX ? "hidden" : permanentTracks || permanentTrackX ? "scroll" : "auto",
                    overflowY: noScroll || noScrollY ? "hidden" : permanentTracks || permanentTrackY ? "scroll" : "auto",
                },
                onScroll: this.handleScrollerScroll,
                children: renderDivWithRenderer(contentProps, this.elementRefContent),
                renderer: propsScrollerProps.renderer,
                elementRef: propsScrollerProps.elementRef,
            };
            return renderDivWithRenderer(scrollerProps, this.elementRefScroller);
        }
        const styles = Scrollbar.calculateStyles(this.props, this.state, this.scrollValues, scrollbarWidth);
        const holderChildren = [];
        const contentProps = {
            ...propsContentProps,
            key: "ScrollbarsCustom-Content",
            className: cnb("ScrollbarsCustom-Content", propsContentProps.className),
            style: styles.content,
            children: createContext ? (React.createElement(ScrollbarContext.Provider, { value: { parentScrollbar: this }, children: children })) : (children),
        };
        const scrollerProps = {
            ...propsScrollerProps,
            key: "ScrollbarsCustom-Scroller",
            className: cnb("ScrollbarsCustom-Scroller", propsScrollerProps.className),
            style: styles.scroller,
            children: renderDivWithRenderer(contentProps, this.elementRefContent),
            onScroll: this.handleScrollerScroll,
        };
        const wrapperProps = {
            ...propsWrapperProps,
            key: "ScrollbarsCustom-Wrapper",
            className: cnb("ScrollbarsCustom-Wrapper", propsWrapperProps.className),
            style: styles.wrapper,
            children: renderDivWithRenderer(scrollerProps, this.elementRefScroller),
        };
        holderChildren.push(renderDivWithRenderer(wrapperProps, this.elementRefWrapper));
        if (this.state.trackYVisible || (!removeTracksWhenNotUsed && !removeTrackYWhenNotUsed)) {
            const thumbYProps = {
                ...propsThumbYProps,
                key: "ScrollbarsCustom-ThumbY",
                style: styles.thumbY,
                elementRef: this.elementRefThumbY,
                onDrag: this.handleThumbYDrag,
                onDragEnd: this.handleThumbYDragEnd,
                axis: AXIS_DIRECTION.Y,
            };
            const trackYProps = {
                ...propsTrackYProps,
                key: "ScrollbarsCustom-TrackY",
                style: styles.trackY,
                elementRef: this.elementRefTrackY,
                onClick: this.handleTrackYClick,
                ...((disableTracksMousewheelScrolling || disableTrackYMousewheelScrolling) && {
                    onWheel: this.handleTrackYMouseWheel,
                }),
                axis: AXIS_DIRECTION.Y,
            };
            trackYProps.children = React.createElement(ScrollbarThumb, Object.assign({}, thumbYProps));
            holderChildren.push(React.createElement(ScrollbarTrack, Object.assign({}, trackYProps)));
        }
        else {
            this.elementRefTrackY(null);
            this.elementRefThumbY(null);
        }
        if (this.state.trackXVisible || (!removeTracksWhenNotUsed && !removeTrackXWhenNotUsed)) {
            const thumbXProps = {
                ...propsThumbXProps,
                key: "ScrollbarsCustom-ThumbX",
                style: styles.thumbX,
                elementRef: this.elementRefThumbX,
                onDrag: this.handleThumbXDrag,
                onDragEnd: this.handleThumbXDragEnd,
                axis: AXIS_DIRECTION.X,
            };
            const trackXProps = {
                ...propsTrackXProps,
                key: "ScrollbarsCustom-TrackX",
                style: styles.trackX,
                elementRef: this.elementRefTrackX,
                onClick: this.handleTrackXClick,
                ...((disableTracksMousewheelScrolling || disableTrackXMousewheelScrolling) && {
                    onWheel: this.handleTrackXMouseWheel,
                }),
                axis: AXIS_DIRECTION.X,
            };
            trackXProps.children = React.createElement(ScrollbarThumb, Object.assign({}, thumbXProps));
            holderChildren.push(React.createElement(ScrollbarTrack, Object.assign({}, trackXProps)));
        }
        else {
            this.elementRefTrackX(null);
            this.elementRefThumbX(null);
        }
        const holderProps = {
            ...propsHolderProps,
            className: cnb("ScrollbarsCustom", this.state.trackYVisible && "trackYVisible", this.state.trackXVisible && "trackXVisible", this.state.isRTL && "rtl", propsHolderProps.className),
            style: styles.holder,
            children: holderChildren,
        };
        return renderDivWithRenderer(holderProps, this.elementRefHolder);
    }
}
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
    thumbYProps: {},
};

export { Scrollbar, ScrollbarContext, Scrollbar as default };
