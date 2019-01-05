import PropTypes from "prop-types";
import React from "react";

export default class NativeScrollbarOld extends React.Component {
    static propTypes = {
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

    static defaultProps = {
        tagName: "div",
    };

    render() {
        const {
            rtl,
            momentum,
            permanentTrackX,
            permanentTrackY,
            permanentTracks,
            noScrollX,
            noScrollY,
            noScroll,
            tagName,
            className,
            style,
            elementRef,
            children,

            ...props
        } = this.props;

        const classNames = "ScrollbarsCustom native" + (rtl ? " rtl" : "") + (className ? " " + className : "");

        const styles = {
            position: "relative",
            ...style,
            ...(rtl && {direction: "rtl"}),
            ...(momentum && {WebkitOverflowScrolling: "touch"}),
            overflowX: noScroll || noScrollX ? "hidden" : permanentTracks || permanentTrackX ? "scroll" : "auto",
            overflowY: noScroll || noScrollY ? "hidden" : permanentTracks || permanentTrackY ? "scroll" : "auto",
        };

        return (
            <this.props.tagName
                style={styles}
                className={classNames}
                ref={ref => {
                    this.element = ref;

                    typeof elementRef === "function" && elementRef(ref);
                }}
                {...props}>
                {children}
            </this.props.tagName>
        );
    }
}
