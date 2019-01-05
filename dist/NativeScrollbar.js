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
class NativeScrollbar extends React.Component {
    render() {
        const _a = this.props, { rtl, momentum, permanentTrackX, permanentTrackY, permanentTracks, noScrollX, noScrollY, noScroll, tagName, className, style, elementRef } = _a, props = __rest(_a, ["rtl", "momentum", "permanentTrackX", "permanentTrackY", "permanentTracks", "noScrollX", "noScrollY", "noScroll", "tagName", "className", "style", "elementRef"]);
        const TagName = tagName;
        const classNames = "ScrollbarsCustom native" + (rtl ? " rtl" : "") + (className ? " " + className : "");
        const styles = Object.assign({ position: "relative" }, style, (rtl && { direction: "rtl" }), (momentum && { WebkitOverflowScrolling: "touch" }), { overflowX: noScroll || noScrollX ? "hidden" : permanentTracks || permanentTrackX ? "scroll" : "auto", overflowY: noScroll || noScrollY ? "hidden" : permanentTracks || permanentTrackY ? "scroll" : "auto" });
        return (React.createElement(TagName, Object.assign({ style: styles, className: classNames, ref: ref => {
                this.element = ref;
                typeof elementRef === "function" && elementRef(ref);
            } }, props)));
    }
}
NativeScrollbar.displayName = "Scrollbars NativeScrollbar";
NativeScrollbar.propTypes = {
    rtl: PropTypes.bool,
    momentum: PropTypes.bool,
    permanentTrackX: PropTypes.bool,
    permanentTrackY: PropTypes.bool,
    permanentTracks: PropTypes.bool,
    noScrollX: PropTypes.bool,
    noScrollY: PropTypes.bool,
    noScroll: PropTypes.bool,
    tagName: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    elementRef: PropTypes.func,
};
NativeScrollbar.defaultProps = {
    tagName: "div",
};
exports.default = NativeScrollbar;
