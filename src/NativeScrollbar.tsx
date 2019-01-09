import * as React from "react";
import * as PropTypes from "prop-types";

export type NativeScrollbarProps = React.HTMLProps<HTMLDivElement> & {
    rtl?: boolean;
    momentum?: boolean;
    permanentTrackX?: boolean;
    permanentTrackY?: boolean;
    permanentTracks?: boolean;
    noScrollX?: boolean;
    noScrollY?: boolean;
    noScroll?: boolean;
    tagName?: string;
    className?: string;
    style?: React.CSSProperties;
    elementRef?: (element: HTMLElement | null) => void;
};

export default class NativeScrollbar extends React.Component<NativeScrollbarProps> {
    public static displayName = "Scrollbars NativeScrollbar";

    public static propTypes = {
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
    public static defaultProps = {
        tagName: "div",
    };
    private element: HTMLElement;

    public render(): React.ReactElement<any> {
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

            ...props
        }: NativeScrollbarProps = this.props;

        const TagName: any = tagName;

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
            <TagName
                style={styles}
                className={classNames}
                ref={ref => {
                    this.element = ref;

                    typeof elementRef === "function" && elementRef(ref);
                }}
                {...props}
            />
        );
    }
}
