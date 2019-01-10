import * as React from "react";
import * as PropTypes from "prop-types";
import Track, {DIRECTION_AXIS, TrackClickValues, TrackProps} from "./Track";
import Thumb, {ThumbProps} from "./Thumb";
import {getInnerHeight, getInnerWidth} from "./getInnerSizes";
import getScrollbarWidth from "./getScrollbarWidth";
import {
    DirectionProperty,
    OverflowXProperty,
    OverflowYProperty,
    PositionProperty,
    WebkitOverflowScrollingProperty,
} from "csstype";
import {UpdateLoop} from "./UpdateLoop";

const updateLoop = new UpdateLoop();

type StylesList = {
    holder: React.CSSProperties;
    wrapper: React.CSSProperties;
    content: React.CSSProperties;
    trackX?: React.CSSProperties;
    trackY?: React.CSSProperties;
    thumbX?: React.CSSProperties;
    thumbY?: React.CSSProperties;
    track?: {
        common: React.CSSProperties;
        x: React.CSSProperties;
        y: React.CSSProperties;
    };
    thumb?: {
        common: React.CSSProperties;
        x: React.CSSProperties;
        y: React.CSSProperties;
    };
};

const defaultStyles: StylesList = {
    holder: {
        position: "relative" as PositionProperty,
        display: "flex",
    },
    wrapper: {
        flexGrow: 1,
    },
    content: {
        position: "absolute" as PositionProperty,
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    track: {
        common: {
            position: "absolute" as PositionProperty,
            overflow: "hidden",
            borderRadius: 4,
            background: "rgba(0,0,0,.1)",
            userSelect: "none",
        },
        x: {
            height: 8,
            width: "calc(100% - 16px)",
            bottom: 0,
            left: 8,
        },
        y: {
            width: 8,
            height: "calc(100% - 16px)",
            top: 8,
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
    isRTL?: boolean;
};

export enum TRACK_CLICK_BEHAVIOUR {
    JUMP = "jump",
    STEP = "step",
}

export type ElementRef = (element: HTMLElement | null) => void;

export type ElementProps = React.HTMLProps<HTMLDivElement> & {
    elementRef?: ElementRef;

    renderer?: React.FunctionComponent<ElementProps>;
};

type ScrollbarOwnProps = {
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

    elementRef?: ElementRef;

    renderer?: React.FunctionComponent<ScrollbarProps>;

    onScroll?: (scrollValues: ScrollValues) => void;
    onScrollStart?: () => void;
    onScrollStop?: () => void;
};

export type ScrollbarProps = ScrollbarOwnProps &
    Pick<ScrollbarOwnProps, Exclude<keyof ScrollbarOwnProps, keyof React.HTMLProps<HTMLDivElement>>>;

export type ScrollbarState = {
    trackXVisible: boolean;
    trackYVisible: boolean;
    isRTL?: boolean;
};

export default class Scrollbar extends React.Component<ScrollbarProps, ScrollbarState> {
    public static propTypes = {
        native: PropTypes.bool,

        minimalThumbsSize: PropTypes.number,

        fallbackScrollbarWidth: PropTypes.number,

        className: PropTypes.string,
        style: PropTypes.object,

        trackClickBehaviour: PropTypes.oneOf([TRACK_CLICK_BEHAVIOUR.JUMP, TRACK_CLICK_BEHAVIOUR.STEP]),

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

        elementRef: PropTypes.func,

        renderer: PropTypes.func,

        onScroll: PropTypes.func,
        onScrollStart: PropTypes.func,
        onScrollStop: PropTypes.func,
    };

    public static defaultProps = {
        native: false,

        minimalThumbSize: 30,

        fallbackScrollbarWidth: 20,

        trackClickBehaviour: TRACK_CLICK_BEHAVIOUR.JUMP,

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

        return (thumbOffset / (trackInnerSize - thumbSize)) * (contentSize - viewportSize);
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
            trackXVisible: false,
            trackYVisible: false,
            isRTL: this.props.rtl,
        };

        this.scrollValues = this.getScrollValues(true);
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
            isRTL: undefined,
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

    get scrollTop() {
        if (this.contentEl) {
            return this.contentEl.scrollTop;
        }

        return 0;
    }

    set scrollTop(top) {
        if (this.contentEl) {
            this.contentEl.scrollTop = top;
            this.update();
        }
    }

    get scrollLeft() {
        if (this.contentEl) {
            return this.contentEl.scrollLeft;
        }

        return 0;
    }

    set scrollLeft(left) {
        if (this.contentEl) {
            this.contentEl.scrollLeft = left;
        }
    }

    get scrollHeight() {
        if (this.contentEl) {
            return this.contentEl.scrollHeight;
        }

        return 0;
    }

    get scrollWidth() {
        if (this.contentEl) {
            return this.contentEl.scrollWidth;
        }

        return 0;
    }

    get clientHeight() {
        if (this.contentEl) {
            return this.contentEl.clientHeight;
        }

        return 0;
    }

    get clientWidth() {
        if (this.contentEl) {
            return this.contentEl.clientWidth;
        }

        return 0;
    }

    public handleTrackClick = (ev: MouseEvent, values: TrackClickValues): void => {
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
        typeof this.props.wrapperProps!.elementRef === "function" && this.props.wrapperProps!.elementRef!(ref);
    };
    public contentElementRef = (ref: HTMLElement | null) => {
        this.contentEl = ref;
        typeof this.props.contentProps!.elementRef === "function" && this.props.contentProps!.elementRef!(ref);
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

    /**
     *
     * @param force Whether to run actualization in spite of changes
     */
    update = (force = false) => {
        if (!this.contentEl) {
            return;
        }

        // autodetect direction if not defined
        if (typeof this.state.isRTL !== "boolean") {
            this.setState({isRTL: getComputedStyle(this.contentEl).direction === "rtl"});

            return this.getScrollValues();
        }

        const scrollValues = this.getScrollValues(true);

        let bitmask = 0;

        if (this.scrollValues) {
            this.scrollValues.clientHeight !== scrollValues.clientHeight && (bitmask |= 1 << 0);
            this.scrollValues.clientWidth !== scrollValues.clientWidth && (bitmask |= 1 << 1);
            this.scrollValues.scrollHeight !== scrollValues.scrollHeight && (bitmask |= 1 << 2);
            this.scrollValues.scrollWidth !== scrollValues.scrollWidth && (bitmask |= 1 << 3);
            this.scrollValues.scrollTop !== scrollValues.scrollTop && (bitmask |= 1 << 4);
            this.scrollValues.scrollLeft !== scrollValues.scrollLeft && (bitmask |= 1 << 5);
            this.scrollValues.scrollYBlocked !== scrollValues.scrollYBlocked && (bitmask |= 1 << 6);
            this.scrollValues.scrollXBlocked !== scrollValues.scrollXBlocked && (bitmask |= 1 << 7);
            this.scrollValues.scrollYPossible !== scrollValues.scrollYPossible && (bitmask |= 1 << 8);
            this.scrollValues.scrollXPossible !== scrollValues.scrollXPossible && (bitmask |= 1 << 9);
            this.scrollValues.trackYVisible !== scrollValues.trackYVisible && (bitmask |= 1 << 10);
            this.scrollValues.trackXVisible !== scrollValues.trackXVisible && (bitmask |= 1 << 11);
            this.scrollValues.isRTL !== scrollValues.isRTL && (bitmask |= 1 << 12);

            // if not forced and nothing has changed - skip this step
            if (bitmask === 0 && !force) {
                return this.scrollValues;
            }
        } else {
            bitmask = 0x1111111111111;
        }

        if ((this.props.native ? this.updaterNative : this.updaterCustom)(bitmask, scrollValues)) {
            this.scrollValues = scrollValues;
            this.scrollValues.scrollTop !== null && this.props.onScroll && this.props.onScroll(scrollValues);
        }

        return this.scrollValues;
    };

    updaterNative = (): boolean => {
        return true;
    };

    updaterCustom = (bitmask: number, scrollValues: ScrollValues): boolean => {
        // if scrollbars visibility has changed
        if (bitmask & (1 << 10) || bitmask & (1 << 11)) {
            this.scrollValues.scrollYBlocked = scrollValues.scrollYBlocked;
            this.scrollValues.scrollXBlocked = scrollValues.scrollXBlocked;
            this.scrollValues.scrollYPossible = scrollValues.scrollYPossible;
            this.scrollValues.scrollXPossible = scrollValues.scrollXPossible;

            this.setState({
                trackYVisible: (this.scrollValues.trackYVisible = scrollValues.trackYVisible)!,
                trackXVisible: (this.scrollValues.trackXVisible = scrollValues.trackXVisible)!,
            });

            return false;
        }

        if (this.trackYEl) {
            bitmask & (1 << 10) && (this.trackYEl.style.display = scrollValues.trackYVisible ? null : "none");

            if (
                this.thumbYEl &&
                (bitmask & (1 << 0) ||
                    bitmask & (1 << 2) ||
                    bitmask & (1 << 4) ||
                    bitmask & (1 << 6) ||
                    bitmask & (1 << 8))
            ) {
                if (scrollValues.scrollYPossible) {
                    const trackInnerSize = getInnerHeight(this.trackYEl);
                    const thumbSize = Scrollbar.calculateThumbSize(
                        trackInnerSize,
                        scrollValues.clientHeight!,
                        scrollValues.scrollHeight!,
                        this.props.minimalThumbSize!
                    );
                    const thumbOffset = Scrollbar.calculateThumbOffset(
                        trackInnerSize,
                        thumbSize,
                        scrollValues.clientHeight!,
                        scrollValues.scrollHeight!,
                        scrollValues.scrollTop!
                    );

                    this.thumbYEl.style.transform = `translateY(${thumbOffset}px)`;
                    this.thumbYEl.style.height = thumbSize + "px";
                    this.thumbYEl.style.display = null;
                } else {
                    this.thumbYEl.style.transform = null;
                    this.thumbYEl.style.height = "0px";
                    this.thumbYEl.style.display = "none";
                }
            }
        }

        if (this.trackXEl) {
            bitmask & (1 << 11) && (this.trackXEl.style.display = scrollValues.trackXVisible ? null : "none");

            if (
                this.thumbXEl &&
                (bitmask & (1 << 1) ||
                    bitmask & (1 << 3) ||
                    bitmask & (1 << 5) ||
                    bitmask & (1 << 7) ||
                    bitmask & (1 << 9))
            ) {
                if (scrollValues.scrollXPossible) {
                    const trackInnerSize = getInnerWidth(this.trackXEl);
                    const thumbSize = Scrollbar.calculateThumbSize(
                        trackInnerSize,
                        scrollValues.clientWidth!,
                        scrollValues.scrollWidth!,
                        this.props.minimalThumbSize!
                    );
                    const thumbOffset = Scrollbar.calculateThumbOffset(
                        trackInnerSize,
                        thumbSize,
                        scrollValues.clientWidth!,
                        scrollValues.scrollWidth!,
                        scrollValues.scrollLeft!
                    );

                    this.thumbXEl.style.transform = `translateX(${thumbOffset}px)`;
                    this.thumbXEl.style.width = thumbSize + "px";
                    this.thumbXEl.style.display = null;
                } else {
                    this.thumbXEl.style.transform = null;
                    this.thumbXEl.style.width = "0px";
                    this.thumbXEl.style.display = "none";
                }
            }
        }

        if (this.props.translateContentSizesToHolder && this.holderEl && (bitmask & (1 << 2) || bitmask & (1 << 3))) {
            this.holderEl.style.width = scrollValues.scrollWidth + "px";
            this.holderEl.style.height = scrollValues.scrollHeight + "px";
        }

        return true;
    };

    handleScrollEvent = () => {
        this.scrollDetect();
    };

    private timeoutID;

    scrollDetect = () => {
        if (!this.props.onScrollStart && !this.props.onScrollStop) {
            return;
        }

        !this.timeoutID && this.props.onScrollStart && this.props.onScrollStart.call(this, this.getScrollValues());

        this.timeoutID && clearTimeout(this.timeoutID);

        this.timeoutID = setTimeout(() => {
            this.timeoutID = null;

            this.props.onScrollStop && this.props.onScrollStop.call(this, this.getScrollValues());
        }, this.props.scrollDetectionThreshold);
    };

    public componentDidMount(): void {
        if (!this.contentEl) {
            this.setState(() => {
                throw new Error(
                    "Somewhy element was not created. Possibly you haven't provided HTMLElement to elementRef renderer's property."
                );
            });
            return;
        }

        updateLoop.addScrollbar(this);

        this.contentEl.addEventListener("scroll", this.handleScrollEvent, {passive: true});

        if (typeof this.props.scrollTop !== "undefined") {
            this.contentEl.scrollTop = this.props.scrollTop;
        }

        if (typeof this.props.scrollLeft !== "undefined") {
            this.contentEl.scrollLeft = this.props.scrollLeft;
        }

        this.update();
    }

    public componentWillUnmount(): void {
        updateLoop.removeScrollbar(this);

        this.contentEl && this.contentEl.removeEventListener("scroll", this.handleScrollEvent);
    }

    public componentDidUpdate(prevProps: Readonly<ScrollbarProps>, prevState: Readonly<ScrollbarState>): void {
        if (!this.contentEl) {
            return;
        }

        if (this.props.rtl !== prevProps.rtl && this.props.rtl !== this.state.isRTL) {
            this.setState({isRTL: this.props.rtl});
        }

        if (this.state.isRTL !== prevState.isRTL) {
            this.update();
        }

        if (this.props.scrollTop !== prevProps.scrollTop) {
            if (typeof this.props.scrollTop !== "undefined") {
                this.contentEl.scrollTop = this.props.scrollTop;
            }
        }

        if (this.props.scrollLeft !== prevProps.scrollLeft) {
            if (typeof this.props.scrollLeft !== "undefined") {
                this.contentEl.scrollLeft = this.props.scrollLeft;
            }
        }
    }

    public render() {
        const {
            native,

            minimalThumbSize,
            fallbackScrollbarWidth,

            scrollDetectionThreshold,
            onScroll,
            onScrollStart,
            onScrollStop,

            className,

            wrapperProps: propsWrapperProps,
            contentProps: propsContentProps,
            trackXProps: propsTrackXProps,
            trackYProps: propsTrackYProps,
            thumbXProps: propsThumbXProps,
            thumbYProps: propsThumbYProps,

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

            trackClickBehaviour,

            scrollLeft,
            scrollTop,

            renderer,

            children,

            ...props
        } = this.props;

        const browserScrollbarWidth = getScrollbarWidth();
        const scrollbarWidth = browserScrollbarWidth || fallbackScrollbarWidth!;

        const styles = Scrollbar.calculateStyles(
            this.props,
            this.state,
            this.scrollValues,
            browserScrollbarWidth,
            scrollbarWidth,
            this.props.style,
            this.props.wrapperProps!.style,
            this.props.contentProps!.style,
            this.props.trackXProps!.style,
            this.props.trackYProps!.style,
            this.props.thumbXProps!.style,
            this.props.thumbYProps!.style
        );

        const thumbXProps = {
            ...propsThumbXProps,
            style: styles.thumbX,
            key: "thumbX",
            elementRef: this.thumbXElementRef,
            ref: undefined,
        };
        const thumbYProps = {
            ...propsThumbYProps,
            style: styles.thumbY,
            key: "thumbY",
            elementRef: this.thumbYElementRef,
            ref: undefined,
        };

        const trackXProps = {
            ...propsTrackXProps,
            style: styles.trackX,
            key: "trackX",
            elementRef: this.trackXElementRef,
            ref: undefined,
            children: <Thumb axis={DIRECTION_AXIS.X} {...thumbXProps} />,

            onClick: this.handleTrackClick,
        };
        const trackYProps = {
            ...propsTrackYProps,
            style: styles.trackY,
            key: "trackY",
            elementRef: this.trackYElementRef,
            ref: undefined,
            children: <Thumb axis={DIRECTION_AXIS.Y} {...thumbYProps} />,

            onClick: this.handleTrackClick,
        };

        const contentProps = {
            ...propsContentProps,
            style: styles.content,
            key: "content",
            className: "content" + (propsContentProps!.className ? " " + propsContentProps!.className : ""),
            [propsContentProps!.renderer ? "elementRef" : "ref"]: this.contentElementRef,
            renderer: undefined,
            children,
        };

        const wrapperProps = {
            ...propsWrapperProps,
            style: styles.wrapper,
            key: "wrapper",
            className: "wrapper" + (propsWrapperProps!.className ? " " + propsWrapperProps!.className : ""),
            [propsWrapperProps!.renderer ? "elementRef" : "ref"]: this.wrapperElementRef,
            renderer: undefined,
            children: propsContentProps!.renderer ? (
                propsContentProps!.renderer!(contentProps)
            ) : (
                <div {...contentProps} />
            ),
        };

        const holderProps = {
            ...props,
            style: styles.holder,
            className:
                "ScrollbarsCustom" +
                (this.state.trackYVisible ? " trackYVisible" : "") +
                (this.state.trackXVisible ? " trackXVisible" : "") +
                (this.state.isRTL ? " rtl" : "") +
                (className ? " " + className : ""),
            [renderer ? "elementRef" : "ref"]: this.holderElementRef,
            renderer: undefined,
            children: [
                propsWrapperProps!.renderer ? propsWrapperProps!.renderer!(wrapperProps) : <div {...wrapperProps} />,
                (this.state.trackYVisible || !(removeTracksWhenNotUsed && removeTrackYWhenNotUsed)) && (
                    <Track axis={DIRECTION_AXIS.Y} {...trackYProps} />
                ),
                (this.state.trackXVisible || !(removeTracksWhenNotUsed && removeTrackXWhenNotUsed)) && (
                    <Track axis={DIRECTION_AXIS.X} {...trackXProps} />
                ),
            ],
        };

        return renderer ? renderer(holderProps) : <div {...holderProps} />;
    }

    public static calculateStyles(
        props: ScrollbarProps,
        state: ScrollbarState,
        scrollValues: ScrollValues,
        browserScrollbarWidth: number,
        scrollbarWidth: number,
        holderStyles?: React.CSSProperties,
        wrapperStyles?: React.CSSProperties,
        contentStyles?: React.CSSProperties,
        trackXStyles?: React.CSSProperties,
        trackYStyles?: React.CSSProperties,
        thumbXStyles?: React.CSSProperties,
        thumbYStyles?: React.CSSProperties
    ) {
        return {
            holder: {
                ...(props.noDefaultStyles && defaultStyles.holder),
                ...holderStyles,
                ...(typeof props.rtl !== "undefined" && {
                    direction: props.rtl ? ("rtl" as DirectionProperty) : ("ltr" as DirectionProperty),
                }),
            },
            wrapper: {
                ...(props.noDefaultStyles && defaultStyles.wrapper),
                [state.isRTL ? "marginLeft" : "marginRight"]: state.trackYVisible ? 8 : undefined,
                marginBottom: state.trackXVisible ? 8 : undefined,
                ...wrapperStyles,
                position: "relative" as PositionProperty,
                overflow: "hidden",
            },
            content: {
                ...defaultStyles.content,
                ...contentStyles,
                ...(props.momentum && {WebkitOverflowScrolling: "touch" as WebkitOverflowScrollingProperty}),

                overflowY: scrollValues.scrollYPossible
                    ? ("scroll" as OverflowYProperty)
                    : ("hidden" as OverflowYProperty),
                overflowX: scrollValues.scrollXPossible
                    ? ("scroll" as OverflowXProperty)
                    : ("hidden" as OverflowXProperty),

                paddingBottom: !browserScrollbarWidth && scrollValues.scrollXPossible ? scrollbarWidth : undefined,
                marginBottom: scrollValues.scrollXPossible ? -scrollbarWidth : undefined,

                ...(state.isRTL
                    ? {
                          paddingLeft:
                              !browserScrollbarWidth && scrollValues.scrollYPossible ? scrollbarWidth : undefined,
                          marginLeft: scrollValues.scrollYPossible ? -scrollbarWidth : undefined,
                      }
                    : {
                          paddingRight:
                              !browserScrollbarWidth && scrollValues.scrollYPossible ? scrollbarWidth : undefined,
                          marginRight: scrollValues.scrollYPossible ? -scrollbarWidth : undefined,
                      }),
            },
            trackX: {
                ...(props.noDefaultStyles && {
                    ...defaultStyles.track!.common,
                    ...defaultStyles.track!.x,
                }),
                ...trackXStyles,
                ...(!state.trackXVisible && {display: "none"}),
            },
            trackY: {
                ...(props.noDefaultStyles && {
                    ...defaultStyles.track!.common,
                    ...defaultStyles.track!.y,
                }),
                ...trackYStyles,
                [state.isRTL ? "left" : "right"]: 0,
                ...(!state.trackYVisible && {display: "none"}),
            },
            thumbX: {
                ...(props.noDefaultStyles && {
                    ...defaultStyles.thumb!.common,
                    ...defaultStyles.thumb!.x,
                }),
                ...thumbXStyles,
            },
            thumbY: {
                ...(props.noDefaultStyles && {
                    ...defaultStyles.thumb!.common,
                    ...defaultStyles.thumb!.y,
                }),
                ...thumbYStyles,
            },
        };
    }
}
