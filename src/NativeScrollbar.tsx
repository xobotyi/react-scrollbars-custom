import * as React from "react";
import * as PropTypes from "prop-types";
import {
    DirectionProperty,
    OverflowXProperty,
    OverflowYProperty,
    PositionProperty,
    WebkitOverflowScrollingProperty,
} from "./../node_modules/csstype";

type NativeScrollbarOwnProps = {
    scrollTop?: number;
    scrollLeft?: number;
    rtl?: boolean;
    momentum?: boolean;
    permanentTrackX?: boolean;
    permanentTrackY?: boolean;
    permanentTracks?: boolean;
    noScrollX?: boolean;
    noScrollY?: boolean;
    noScroll?: boolean;
    className?: string;
    style?: React.CSSProperties;
    elementRef?: (element: HTMLElement | null) => void;
};

export type NativeScrollbarProps = NativeScrollbarOwnProps &
                                   Pick<NativeScrollbarOwnProps, Exclude<keyof NativeScrollbarOwnProps, keyof React.HTMLProps<HTMLDivElement>>>;

export default class NativeScrollbar extends React.Component<NativeScrollbarProps> {
    public static displayName = "Scrollbar NativeScrollbar";

    public static propTypes = {
        rtl: PropTypes.bool,

        momentum: PropTypes.bool,

        permanentTrackX: PropTypes.bool,
        permanentTrackY: PropTypes.bool,
        permanentTracks: PropTypes.bool,

        noScrollX: PropTypes.bool,
        noScrollY: PropTypes.bool,
        noScroll: PropTypes.bool,

        className: PropTypes.string,

        style: PropTypes.object,

        elementRef: PropTypes.func,

        scrollLeft: PropTypes.number,
        scrollTop: PropTypes.number,
    };

    public element: HTMLElement | null;

    private ref = (ref: HTMLElement | null): void => {
        typeof this.props.elementRef === "function" && this.props.elementRef(ref);
        this.element = ref;
    };

    public componentDidMount(): void {
        if (this.element) {
            typeof this.props.scrollTop !== "undefined" && (this.element.scrollTop = this.props.scrollTop);
            typeof this.props.scrollLeft !== "undefined" && (this.element.scrollLeft = this.props.scrollLeft);
        }
    }

    public componentDidUpdate(): void {
        if (this.element) {
            this.props.scrollTop !== this.element.scrollTop && typeof this.props.scrollTop !== "undefined" && (this.element.scrollTop = this.props.scrollTop);
            this.props.scrollLeft !== this.element.scrollLeft && typeof this.props.scrollLeft !== "undefined" && (this.element.scrollLeft = this.props.scrollLeft);
        }
    }

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
                  className,
                  style,
                  elementRef,

                  scrollLeft,
                  scrollTop,

                  ...props
              }: NativeScrollbarProps = this.props;

        const divProps = {
            ...props,
            className: "ScrollbarsCustom native" + (rtl ? " rtl" : "") + (className ? " " + className : ""),
            style: {
                position: "relative" as PositionProperty,
                ...style,
                ...(rtl && {direction: "rtl" as DirectionProperty}),
                ...(momentum && {WebkitOverflowScrolling: "touch" as WebkitOverflowScrollingProperty}),
                overflowX: (noScroll || noScrollX
                    ? "hidden"
                    : permanentTracks || permanentTrackX
                        ? "scroll"
                        : "auto") as OverflowXProperty,
                overflowY: (noScroll || noScrollY
                    ? "hidden"
                    : permanentTracks || permanentTrackY
                        ? "scroll"
                        : "auto") as OverflowYProperty,
            },
            ref: this.ref,
        };

        return <div {...divProps} />;
    }
}
