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
class Track extends React.Component {
    constructor() {
        super(...arguments);
        this.handleClick = (ev) => {
            if (ev.button !== 0 || !this.element) {
                return;
            }
            if (this.props.onClick && ev.target === this.element) {
                const rect = this.element.getBoundingClientRect();
                this.props.onClick(ev, {
                    axis: this.props.axis,
                    offset: this.props.axis === Scrollbar_1.DIRECTION_AXIS.X ? ev.clientX - rect.left : ev.clientY - rect.top,
                });
            }
            return true;
        };
        this.ref = (ref) => {
            typeof this.props.elementRef === "function" && this.props.elementRef(ref);
            this.element = ref;
        };
    }
    componentDidMount() {
        if (!this.element) {
            this.setState(() => { throw new Error("Somewhy element was not created. Possibly you haven't provided HTMLElement to elementRef renderer's property."); });
            return;
        }
        this.element.addEventListener("click", this.handleClick);
    }
    render() {
        const _a = this.props, { className, renderer, axis, elementRef, onClick, tagName } = _a, props = __rest(_a, ["className", "renderer", "axis", "elementRef", "onClick", "tagName"]);
        props.className =
            "track " + (axis === Scrollbar_1.DIRECTION_AXIS.X ? "trackX" : "trackY") + (className ? " " + className : "");
        const TagName = tagName;
        return renderer ? (renderer(Object.assign({}, props, { axis,
            tagName, elementRef: this.ref }))) : (React.createElement(TagName, Object.assign({}, props, { ref: this.ref })));
    }
}
Track.displayName = "Scrollbars Track";
Track.propTypes = {
    axis: PropTypes.oneOf([Scrollbar_1.DIRECTION_AXIS.X, Scrollbar_1.DIRECTION_AXIS.Y]).isRequired,
    tagName: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    elementRef: PropTypes.func,
    renderer: PropTypes.func,
};
Track.defaultProps = {
    tagName: 'div',
};
exports.default = Track;
