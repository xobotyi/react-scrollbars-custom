import * as React from "react";
import * as PropTypes from "prop-types";
import {TrackClickValues, TrackProps} from "./Track";
import {ThumbProps} from "./Thumb";
import {getInnerHeight, getInnerWidth} from "./getInnerSizes";

type ScrollValues = {
    /**
     * @description Content's native clientHeight parameter
     */
    clientHeight: number | null;
    /**
     * @description Content's native clientWidth parameter
     */
    clientWidth: number | null;
    /**
     * @description Content's native scrollHeight parameter
     */
    scrollHeight: number | null;
    /**
     * @description Content's native scrollWidth parameter
     */
    scrollWidth: number | null;
    /**
     * @description Content's native scrollTop parameter
     */
    scrollTop: number | null;
    /**
     * @description Content's native scrollLeft parameter
     */
    scrollLeft: number | null;
    /**
     * @description Indicates whether vertical scroll blocked via properties
     */
    scrollYBlocked: boolean | null;
    /**
     * @description Indicates whether horizontal scroll blocked via properties
     */
    scrollXBlocked: boolean | null;
    /**
     * @description Indicates whether the content overflows vertically and scrolling not blocked
     */
    scrollYPossible: boolean | null;
    /**
     * @description Indicates whether the content overflows horizontally and scrolling not blocked
     */
    scrollXPossible: boolean | null;
    /**
     * @description Indicates whether vertical track is visible
     */
    trackYVisible: boolean | null;
    /**
     * @description Indicates whether horizontal track is visible
     */
    trackXVisible: boolean | null;
    /**
     * @description Indicates whether display direction is right-to-left
     */
    isRTL: boolean | null;
};

export enum DIRECTION_AXIS {
    X = 1,
    Y = 2,
}

export enum TRACK_CLICK_BEHAVIOUR {
    JUMP = "jump",
    STEP = "step",
}

export type ElementRef = (element: HTMLElement | null) => void;

export type ElementProps = React.HTMLProps<HTMLDivElement> & {
    elementRef: ElementRef;
};

export type ScrollbarProps = {
    native?: boolean;

    minimalThumbSize?: number;

    fallbackScrollbarWidth?: number;

    className?: string;
    tagName?: string;
    style?: React.CSSProperties;

    trackClickBehaviour?: TRACK_CLICK_BEHAVIOUR;

    rtl?: boolean;

    momentum?: boolean;

    noDefaultStyles?: boolean;

    scrollDetectionThreshold?: number;

    translateContentSizesToHolder?: boolean;

    scrollTop?: number;
    scrollLeft?: number;

    noScrollX?: boolean;
    noScrollY?: boolean;
    noScroll?: boolean;

    removeTracksWhenNotUsed?: boolean;
    removeTrackYWhenNotUsed?: boolean;
    removeTrackXWhenNotUsed?: boolean;

    permanentTrackX?: boolean;
    permanentTrackY?: boolean;
    permanentTracks?: boolean;

    wrapperProps?: ElementProps;
    contentProps?: ElementProps;
    trackXProps?: TrackProps;
    trackYProps?: TrackProps;
    thumbXProps?: ThumbProps;
    thumbYProps?: ThumbProps;

    wrapperRenderer?: React.FunctionComponent<ElementProps>;
    contentRenderer?: React.FunctionComponent<ElementProps>;
    trackXRenderer?: React.FunctionComponent<TrackProps>;
    trackYRenderer?: React.FunctionComponent<TrackProps>;
    thumbXRenderer?: React.FunctionComponent<ThumbProps>;
    thumbYRenderer?: React.FunctionComponent<ThumbProps>;

    elementRef?: ElementRef;

    onScroll?: void;
    onScrollStart?: void;
    onScrollStop?: void;
};

export type ScrollbarState = {
    trackXVisible: boolean;
    trackYVisible: boolean;
    isRTL: boolean;
};

export default class Scrollbar extends React.Component<ScrollbarProps, ScrollbarState> {
    public static propTypes = {
        native: PropTypes.bool,

        minimalThumbsSize: PropTypes.number,

        fallbackScrollbarWidth: PropTypes.number,

        tagName: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,

        trackClickBehavior: PropTypes.oneOf([TRACK_CLICK_BEHAVIOUR.JUMP, TRACK_CLICK_BEHAVIOUR.STEP]),

        rtl: PropTypes.bool,

        momentum: PropTypes.bool,

        noDefaultStyles: PropTypes.bool,

        scrollDetectionThreshold: PropTypes.number,

        translateContentSizesToHolder: PropTypes.bool,

        scrollTop: PropTypes.number,
        scrollLeft: PropTypes.number,

        noScrollX: PropTypes.bool,
        noScrollY: PropTypes.bool,
        noScroll: PropTypes.bool,

        removeTracksWhenNotUsed: PropTypes.bool,
        removeTrackYWhenNotUsed: PropTypes.bool,
        removeTrackXWhenNotUsed: PropTypes.bool,

        permanentTrackX: PropTypes.bool,
        permanentTrackY: PropTypes.bool,
        permanentTracks: PropTypes.bool,

        wrapperProps: PropTypes.object,
        contentProps: PropTypes.object,
        trackXProps: PropTypes.object,
        trackYProps: PropTypes.object,
        thumbXProps: PropTypes.object,
        thumbYProps: PropTypes.object,

        wrapperRenderer: PropTypes.func,
        contentRenderer: PropTypes.func,
        trackXRenderer: PropTypes.func,
        trackYRenderer: PropTypes.func,
        thumbXRenderer: PropTypes.func,
        thumbYRenderer: PropTypes.func,

        elementRef: PropTypes.func,

        onScroll: PropTypes.func,
        onScrollStart: PropTypes.func,
        onScrollStop: PropTypes.func,
    };

    public static defaultProps = {
        native: false,

        tagName: "div",

        minimalThumbsSize: 30,

        fallbackScrollbarWidth: 20,

        trackClickBehavior: TRACK_CLICK_BEHAVIOUR.JUMP,

        momentum: true,

        noDefaultStyles: false,

        scrollDetectionThreshold: 100,

        translateContentSizesToHolder: false,

        noScrollX: false,
        noScrollY: false,
        noScroll: false,

        permanentTrackX: false,
        permanentTrackY: false,
        permanentTracks: false,

        removeTracksWhenNotUsed: true,
        removeTrackYWhenNotUsed: true,
        removeTrackXWhenNotUsed: true,

        wrapperProps: {},
        contentProps: {},
        trackXProps: {},
        trackYProps: {},
        thumbXProps: {},
        thumbYProps: {},
    };

    /**
     *  @description Calculate thumb size depending on viewport, content and parent track size.<br/>
     *  If thumb viewportSize >= contentSize size return 0.
     *
     * @param trackInnerSize - Inner sizes of parent track, without padding.
     * @param viewportSize - Size of viewport containing the content.
     * @param contentSize - Size of the scrollable content.
     * @param minimalThumbSize - Minimal thumb size
     */
    public static calculateThumbSize(
        trackInnerSize: number,
        viewportSize: number,
        contentSize: number,
        minimalThumbSize: number
    ): number {
        if (viewportSize >= contentSize) {
            return 0;
        }

        return Math.max((viewportSize / contentSize) * trackInnerSize, minimalThumbSize);
    }

    /**
     * @description Calculate thumb offset for given scroll value.
     *
     * @param trackInnerSize - Inner sizes of parent track, without padding.
     * @param thumbSize - Thumb size.
     * @param viewportSize - Size of viewport containing the content.
     * @param contentSize - Size of the scrollable content.
     * @param scrollValue - Scroll value.
     */
    public static calculateThumbOffset(
        trackInnerSize: number,
        thumbSize: number,
        viewportSize: number,
        contentSize: number,
        scrollValue: number
    ): number {
        if (viewportSize >= contentSize || !thumbSize) {
            return 0;
        }

        return ((trackInnerSize - thumbSize) * scrollValue) / (contentSize - viewportSize);
    }

    /**
     * @description Calculate scroll value from the thumb offset.
     *
     * @param trackInnerSize - Inner sizes of parent track, without padding.
     * @param thumbSize - Thumb size.
     * @param viewportSize - Size of viewport containing the content.
     * @param contentSize - Size of the scrollable content.
     * @param thumbOffset - Thumb offset.
     */
    public static calculateScrollForThumbOffset(
        trackInnerSize: number,
        thumbSize: number,
        viewportSize: number,
        contentSize: number,
        thumbOffset: number
    ): number {
        if (thumbOffset === 0 || viewportSize >= contentSize || !thumbSize) {
            return 0;
        }

        return (thumbOffset / (trackInnerSize + thumbSize)) * (contentSize - viewportSize);
    }

    /**
     * @description Reference to holder element null if it wasn't rendered or <i>native</i> property is true
     */
    public holderEl: HTMLElement | null;
    /**
     * @description Reference to wrapper element null if it wasn't rendered or <i>native</i> property is true
     */
    public wrapperEl: HTMLElement | null;
    /**
     * @description Reference to content element (the one that has the browser's scrollbars and holds the content)
     */
    public contentEl: HTMLElement | null;
    /**
     * @description Reference to track element null if it wasn't rendered
     */
    public trackXEl: HTMLElement | null;
    /**
     * @description Reference to track element null if it wasn't rendered
     */
    public trackYEl: HTMLElement | null;
    /**
     * @description Reference to thumb element null if it wasn't rendered
     */
    public thumbXEl: HTMLElement | null;
    /**
     * @description Reference to thumb element null if it wasn't rendered
     */
    public thumbYEl: HTMLElement | null;

    /**
     * @description Current ScrollValues (cached)
     */
    private scrollValues: ScrollValues;

    constructor(props) {
        super(props);

        this.state = {
            trackXVisible: true,
            trackYVisible: true,
            isRTL: this.props.rtl!,
        };
    }

    /**
     * @description Get current scroll-related values.<br/>
     * If <i>force</i> if truthy - will recalculate them instead of returning cached values.
     *
     * @return ScrollValues
     */
    public getScrollValues = (force = false): ScrollValues => {
        if (!force) {
            return {...this.scrollValues};
        }

        let scrollValues: ScrollValues = {
            clientHeight: null,
            clientWidth: null,
            scrollHeight: null,
            scrollWidth: null,
            scrollTop: null,
            scrollLeft: null,
            scrollYBlocked: null,
            scrollXBlocked: null,
            scrollYPossible: null,
            scrollXPossible: null,
            trackYVisible: null,
            trackXVisible: null,
            isRTL: null,
        };

        if (this.contentEl) {
            scrollValues.clientHeight = this.contentEl.clientHeight;
            scrollValues.clientWidth = this.contentEl.clientWidth;

            scrollValues.scrollHeight = this.contentEl.scrollHeight;
            scrollValues.scrollWidth = this.contentEl.scrollWidth;
            scrollValues.scrollTop = this.contentEl.scrollTop;
            scrollValues.scrollLeft = this.contentEl.scrollLeft;

            scrollValues.isRTL = this.state.isRTL;

            scrollValues.scrollYBlocked = this.props.noScroll! || this.props.noScrollY!;
            scrollValues.scrollXBlocked = this.props.noScroll! || this.props.noScrollX!;

            scrollValues.scrollYPossible =
                !scrollValues.scrollYBlocked && scrollValues.scrollHeight > scrollValues.clientHeight;
            scrollValues.scrollXPossible =
                !scrollValues.scrollXBlocked && scrollValues.scrollWidth > scrollValues.clientWidth;

            scrollValues.trackYVisible =
                scrollValues.scrollYPossible || this.props.permanentTracks! || this.props.permanentTrackY!;
            scrollValues.trackXVisible =
                scrollValues.scrollXPossible || this.props.permanentTracks! || this.props.permanentTrackX!;
        }

        return scrollValues;
    };

    /**
     * @description Scroll to top border
     */
    public scrollToTop = (): Scrollbar => {
        if (this.contentEl) {
            this.contentEl.scrollTop = 0;
        }

        return this;
    };
    /**
     * @description Scroll to left border
     */
    public scrollToLeft = (): Scrollbar => {
        if (this.contentEl) {
            this.contentEl.scrollLeft = 0;
        }

        return this;
    };
    /**
     * @description Scroll to bottom border
     */
    public scrollToBottom = (): Scrollbar => {
        if (this.contentEl) {
            this.contentEl.scrollTop = this.contentEl.scrollHeight;
        }

        return this;
    };
    /**
     * @description Scroll to right border
     */
    public scrollToRight = (): Scrollbar => {
        if (this.contentEl) {
            this.contentEl.scrollLeft = this.contentEl.scrollWidth;
        }

        return this;
    };

    /**
     * @description Set the scrolls at given coordinates.<br/>
     * If coordinate is undefined - current scroll value will persist.
     */
    public scrollTo = (x?: number, y?: number): Scrollbar => {
        if (this.contentEl) {
            typeof x === "number" && (this.contentEl.scrollLeft = x);
            typeof y === "number" && (this.contentEl.scrollTop = y);
        }

        return this;
    };

    /**
     * @description Center the viewport at given coordinates.<br/>
     * If coordinate is undefined - current scroll value will persist.
     */
    public centerAt = (x?: number, y?: number): Scrollbar => {
        if (this.contentEl) {
            typeof x === "number" && (this.contentEl.scrollLeft = x - this.contentEl.clientWidth / 2);
            typeof y === "number" && (this.contentEl.scrollTop = y - this.contentEl.clientHeight / 2);
        }

        return this;
    };

    public handleTrackClick = (ev: MouseEvent, values: TrackClickValues) => {
        let scrollTarget: number;
        let thumbSize: number;

        if (values.axis === DIRECTION_AXIS.X) {
            this.props.trackXProps!.onClick && this.props.trackXProps!.onClick!(ev, values);

            if (!this.contentEl || !this.scrollValues.scrollXPossible) {
                return;
            }

            thumbSize = this.thumbXEl!.clientWidth;

            scrollTarget = Scrollbar.calculateScrollForThumbOffset(
                getInnerWidth(this.trackXEl!),
                thumbSize,
                this.scrollValues.clientWidth!,
                this.scrollValues.scrollWidth!,
                values.offset - thumbSize / 2
            );

            if (this.props.trackClickBehaviour === TRACK_CLICK_BEHAVIOUR.JUMP) {
                this.contentEl.scrollLeft = scrollTarget;
            } else {
                this.contentEl.scrollLeft =
                    this.contentEl.scrollLeft < scrollTarget
                        ? this.contentEl.scrollLeft + this.contentEl.clientWidth
                        : this.contentEl.scrollLeft - this.contentEl.clientWidth;
            }
        } else {
            this.props.trackYProps!.onClick && this.props.trackYProps!.onClick!(ev, values);

            if (!this.contentEl || !this.scrollValues.scrollYPossible) {
                return;
            }

            thumbSize = this.thumbYEl!.clientHeight;

            scrollTarget = Scrollbar.calculateScrollForThumbOffset(
                getInnerHeight(this.trackYEl!),
                thumbSize,
                this.scrollValues.clientHeight!,
                this.scrollValues.scrollHeight!,
                values.offset - thumbSize / 2
            );

            if (this.props.trackClickBehaviour === TRACK_CLICK_BEHAVIOUR.JUMP) {
                this.contentEl.scrollTop = scrollTarget;
            } else {
                this.contentEl.scrollTop =
                    this.contentEl.scrollTop < scrollTarget
                        ? this.contentEl.scrollTop + this.contentEl.clientHeight
                        : this.contentEl.scrollTop - this.contentEl.clientHeight;
            }
        }
    };

    public holderElementRef = (ref: HTMLElement | null) => {
        this.holderEl = ref;
        typeof this.props.elementRef === "function" && this.props.elementRef(ref);
    };
    public wrapperElementRef = (ref: HTMLElement | null) => {
        this.wrapperEl = ref;
        typeof this.props.wrapperProps!.elementRef === "function" && this.props.wrapperProps!.elementRef(ref);
    };
    public contentElementRef = (ref: HTMLElement | null) => {
        this.contentEl = ref;
        typeof this.props.contentProps!.elementRef === "function" && this.props.contentProps!.elementRef(ref);
    };
    public trackXElementRef = (ref: HTMLElement | null) => {
        this.trackXEl = ref;
        typeof this.props.trackXProps!.elementRef === "function" && this.props.trackXProps!.elementRef!(ref);
    };
    public trackYElementRef = (ref: HTMLElement | null) => {
        this.trackYEl = ref;
        typeof this.props.trackYProps!.elementRef === "function" && this.props.trackYProps!.elementRef!(ref);
    };
    public thumbXElementRef = (ref: HTMLElement | null) => {
        this.thumbXEl = ref;
        typeof this.props.thumbXProps!.elementRef === "function" && this.props.thumbXProps!.elementRef!(ref);
    };
    public thumbYElementRef = (ref: HTMLElement | null) => {
        this.thumbYEl = ref;
        const thumbProps = this.props.thumbYProps!;
        typeof thumbProps.elementRef === "function" && thumbProps.elementRef(ref);
    };

    update = () => {};

    render() {
        const scrollValues = this.getScrollValues();

        const {
            native,

            minimalThumbSize,
            fallbackScrollbarWidth,

            scrollDetectionThreshold,
            onScroll,
            onScrollStart,
            onScrollStop,

            tagName,
            className,
            style,

            wrapperProps,
            contentProps,
            trackXProps,
            trackYProps,
            thumbXProps,
            thumbYProps,
            wrapperRenderer,
            contentRenderer,
            trackXRenderer,
            trackYRenderer,
            thumbXRenderer,
            thumbYRenderer,

            removeTracksWhenNotUsed,
            removeTrackYWhenNotUsed,
            removeTrackXWhenNotUsed,

            noScrollX,
            noScrollY,
            noScroll,

            permanentTrackX,
            permanentTrackY,
            permanentTracks,

            rtl,

            momentum,

            noDefaultStyles,

            translateContentSizesToHolder,

            scrollLeft,
            scrollTop,

            children,

            ...props
        } = this.props;

        wrapperProps!.key = "wrapper";
        contentProps!.key = "content";
        trackXProps!.key = "trackX";
        trackYProps!.key = "trackY";
        thumbXProps!.key = "thumbX";
        thumbYProps!.key = "thumbY";

        trackXProps!.renderer = trackXRenderer;
        trackYProps!.renderer = trackYRenderer;
        thumbXProps!.renderer = thumbXRenderer;
        thumbYProps!.renderer = thumbYRenderer;

        const TagName: any = tagName;

        return <TagName {...props} ref={this.holderElementRef} />;
    }
}
