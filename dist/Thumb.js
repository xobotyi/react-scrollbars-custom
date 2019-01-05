"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const PropTypes = require("prop-types");
const Scrollbar_1 = require("./Scrollbar");
class Thumb extends React.Component {
    constructor() {
        super(...arguments);
        this.dragging = false;
        this.dragInitialOffsetX = 0;
        this.dragInitialOffsetY = 0;
        this.handleMousedown = (ev) => {
            if (ev.button !== 0 || !this.element) {
                return;
            }
            ev.preventDefault();
            ev.stopImmediatePropagation();
            if (global.document) {
                global.document.addEventListener("mousemove", this.handleDrag, { passive: true });
                global.document.addEventListener("mouseup", this.handleDragEnd, { passive: true });
            }
            this.handleDragStart(ev);
        };
        this.handleTouchStart = (ev) => {
            if (ev.touches.length > 1 || !this.element) {
                return;
            }
            ev.preventDefault();
            ev.stopImmediatePropagation();
            if (global.document) {
                global.document.addEventListener("touchmove", this.handleDrag, { passive: true });
                global.document.addEventListener("touchend", this.handleDragEnd, { passive: true });
            }
            this.handleDragStart(ev);
        };
        this.handleDragStart = (ev) => {
            if (!this.element) {
                this.handleDragEnd();
                return;
            }
            this.dragging = true;
            this.element.classList.add('dragging');
            if (global.document) {
                this.prevUserSelect = global.document.body.style.userSelect;
                global.document.body.style.userSelect = "none";
                // @ts-ignore
                this.prevOnSelectStart = global.document.onselectstart;
                // @ts-ignore
                global.document.onselectstart = () => false;
            }
            const thumbRect = this.element.getBoundingClientRect();
            const parentRect = this.element.offsetParent
                ? this.element.offsetParent.getBoundingClientRect()
                : { left: 0, top: 0 };
            let clientX;
            let clientY;
            if (ev instanceof TouchEvent) {
                clientX = ev.touches[0].pageX;
                clientY = ev.touches[0].pageY;
            }
            else {
                clientX = ev.clientX;
                clientY = ev.clientY;
            }
            this.dragInitialOffsetX = clientX - thumbRect.left - thumbRect.width / 2;
            this.dragInitialOffsetY = clientY - thumbRect.top - thumbRect.height / 2;
            this.props.onDragStart &&
                this.props.onDragStart({
                    axis: this.props.type,
                    offset: this.props.type === Scrollbar_1.DIRECTION_AXIS.X
                        ? clientX - parentRect.left - this.dragInitialOffsetX
                        : clientY - parentRect.top - this.dragInitialOffsetY,
                });
        };
        this.handleDrag = (ev) => {
            if (!this.dragging || !this.element) {
                this.handleDragEnd();
                return;
            }
            const parentRect = this.element.offsetParent
                ? this.element.offsetParent.getBoundingClientRect()
                : { left: 0, top: 0 };
            let clientX;
            let clientY;
            if (ev instanceof TouchEvent) {
                clientX = ev.touches[0].pageX;
                clientY = ev.touches[0].pageY;
            }
            else {
                clientX = ev.clientX;
                clientY = ev.clientY;
            }
            this.props.onDrag &&
                this.props.onDrag({
                    axis: this.props.type,
                    offset: this.props.type === Scrollbar_1.DIRECTION_AXIS.X
                        ? clientX - parentRect.left - this.dragInitialOffsetX
                        : clientY - parentRect.top - this.dragInitialOffsetY,
                });
        };
        this.handleDragEnd = (ev) => {
            if (global.document) {
                global.document.removeEventListener("touchmove", this.handleDrag);
                global.document.removeEventListener("touchend", this.handleDragEnd);
                global.document.removeEventListener("mousemove", this.handleDrag);
                global.document.removeEventListener("mouseup", this.handleDragEnd);
                global.document.body.style.userSelect = this.prevUserSelect;
                this.prevUserSelect = null;
                // @ts-ignore
                global.document.onselectstart = this.prevOnSelectStart;
                this.prevOnSelectStart = null;
            }
            let offset = 0;
            if (this.element) {
                this.element.classList.remove('dragging');
                if (this.dragging && ev) {
                    const parentRect = this.element.offsetParent
                        ? this.element.offsetParent.getBoundingClientRect()
                        : { left: 0, top: 0 };
                    let clientX;
                    let clientY;
                    if (ev instanceof TouchEvent) {
                        clientX = ev.touches[0].pageX;
                        clientY = ev.touches[0].pageY;
                    }
                    else {
                        clientX = ev.clientX;
                        clientY = ev.clientY;
                    }
                    offset = this.props.type === Scrollbar_1.DIRECTION_AXIS.X
                        ? clientX - parentRect.left - this.dragInitialOffsetX
                        : clientY - parentRect.top - this.dragInitialOffsetY;
                }
            }
            this.dragging = false;
            this.dragInitialOffsetX = 0;
            this.dragInitialOffsetY = 0;
            this.props.onDragEnd &&
                this.props.onDragEnd({
                    axis: this.props.type,
                    offset,
                });
        };
        this.ref = (ref) => {
            typeof this.props.elementRef === "function" && this.props.elementRef(ref);
            this.element = ref;
        };
    }
    componentDidMount() {
        if (!this.element) {
            throw new Error("Somewhy element was not created.");
        }
        this.element.addEventListener('mousedown', this.handleMousedown);
        this.element.addEventListener('touchstart', this.handleTouchStart);
    }
    render() {
        const _a = this.props, { className, renderer, type, elementRef, onDrag, onDragStart, onDragEnd } = _a, props = __rest(_a, ["className", "renderer", "type", "elementRef", "onDrag", "onDragStart", "onDragEnd"]);
        props.className = 'track ' + (type === Scrollbar_1.DIRECTION_AXIS.X ? 'trackX' : 'trackY') + (className ? ' ' + className : '');
        return renderer ? (renderer(Object.assign({}, props, { type, elementRef: this.ref }))) : (React.createElement("div", Object.assign({}, props, { ref: this.ref })));
    }
}
Thumb.displayName = 'Scrollbars ThumbOld';
Thumb.propTypes = {
    type: PropTypes.oneOf([Scrollbar_1.DIRECTION_AXIS.X, Scrollbar_1.DIRECTION_AXIS.Y]).isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    onDrag: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    elementRef: PropTypes.func,
    renderer: PropTypes.func,
};
exports.default = Thumb;
