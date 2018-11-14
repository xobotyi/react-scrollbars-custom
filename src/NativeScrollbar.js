import PropTypes from "prop-types";
import React from "react";

export default class NativeScrollbar extends React.Component {
    static propTypes = {
        tagName: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,

        onScroll: PropTypes.func,

        elementRef: PropTypes.func,
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
