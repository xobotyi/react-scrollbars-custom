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
            if (this.props.onClick && ev.target === this.element) {
                const rect = this.element.getBoundingClientRect();
                this.props.onClick(ev, {
                    axis: this.props.type,
                    offset: this.props.type === Scrollbar_1.DIRECTION_AXIS.X ? ev.clientX - rect.left : ev.clientY - rect.top,
                });
            }
            return true;
        };
        this.ref = (ref) => {
            typeof this.props.elementRef === "function" && this.props.elementRef(ref);
            this.element = ref;
        };
    }
    render() {
        const _a = this.props, { className, renderer, type, elementRef, onClick } = _a, props = __rest(_a, ["className", "renderer", "type", "elementRef", "onClick"]);
        props.className =
            "track " + (type === Scrollbar_1.DIRECTION_AXIS.X ? "trackX" : "trackY") + (className ? " " + className : "");
        props.onClick = this.handleClick;
        return renderer ? (renderer(Object.assign({}, props, { type, elementRef: this.ref }))) : (React.createElement("div", Object.assign({}, props, { ref: this.ref })));
    }
}
Track.displayName = "Scrollbars Track";
Track.propTypes = {
    type: PropTypes.oneOf([Scrollbar_1.DIRECTION_AXIS.X, Scrollbar_1.DIRECTION_AXIS.Y]).isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    elementRef: PropTypes.func,
    renderer: PropTypes.func,
};
exports.default = Track;
