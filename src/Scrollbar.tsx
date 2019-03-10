import * as React from "react";
import * as PropTypes from "prop-types";
import Loop from "./Loop";
import cnb from "cnbuilder";
import ScrollbarTrack, {
  DIRECTION_AXIS,
  ScrollbarTrackClickParameters,
  ScrollbarTrackProps
} from "./ScrollbarTrack";
import ScrollbarThumb, { ScrollbarThumbProps } from "./ScrollbarThumb";
import getScrollbarWidth, {
  calcScrollForThumbOffset,
  calcThumbOffset,
  calcThumbSize,
  getInnerHeight,
  getInnerWidth,
  shouldReverseRTLScroll,
  uuid
} from "./util";
import { DraggableData } from "react-draggable";

const reverseRTL: boolean = shouldReverseRTLScroll();

export type ScrollValues = {
  /**
   * @description Content's native clientHeight parameter
   */
  clientHeight: number;
  /**
   * @description Content's native clientWidth parameter
   */
  clientWidth: number;
  /**
   * @description Content's native scrollHeight parameter
   */
  scrollHeight: number;
  /**
   * @description Content's native scrollWidth parameter
   */
  scrollWidth: number;
  /**
   * @description Content's native scrollTop parameter
   */
  scrollTop: number;
  /**
   * @description Content's native scrollLeft parameter
   */
  scrollLeft: number;
  /**
   * @description Indicates whether vertical scroll blocked via properties
   */
  scrollYBlocked: boolean;
  /**
   * @description Indicates whether horizontal scroll blocked via properties
   */
  scrollXBlocked: boolean;
  /**
   * @description Indicates whether the content overflows vertically and scrolling not blocked
   */
  scrollYPossible: boolean;
  /**
   * @description Indicates whether the content overflows horizontally and scrolling not blocked
   */
  scrollXPossible: boolean;
  /**
   * @description Indicates whether vertical track is visible
   */
  trackYVisible: boolean;
  /**
   * @description Indicates whether horizontal track is visible
   */
  trackXVisible: boolean;
  /**
   * @description Indicates whether display direction is right-to-left
   */
  isRTL?: boolean;
};

export type ElementRef<T = HTMLElement> = (element: T | null) => void;

export type ElementProps<T = HTMLElement> = React.HTMLProps<T> & {
  elementRef?: ElementRef;

  renderer?: React.FunctionComponent<ElementProps>;
};

export enum SCROLLBAR_TRACK_CLICK_BEHAVIOR {
  JUMP = "jump",
  STEP = "step"
}

export type ScrollbarProps = ElementProps & {
  createContext?: boolean;

  rtl?: boolean;

  momentum?: boolean;
  native?: boolean;

  noScrollX?: boolean;
  noScrollY?: boolean;
  noScroll?: boolean;

  permanentTrackX?: boolean;
  permanentTrackY?: boolean;
  permanentTracks?: boolean;

  removeTracksWhenNotUsed?: boolean;
  removeTrackYWhenNotUsed?: boolean;
  removeTrackXWhenNotUsed?: boolean;

  minimalThumbSize?: number;
  maximalThumbSize?: number;
  minimalThumbXSize?: number;
  maximalThumbXSize?: number;
  minimalThumbYSize?: number;
  maximalThumbYSize?: number;

  scrollbarWidth?: number;
  fallbackScrollbarWidth?: number;

  scrollTop?: number;
  scrollLeft?: number;

  noDefaultStyles?: boolean;

  trackClickBehavior?: SCROLLBAR_TRACK_CLICK_BEHAVIOR;

  wrapperProps?: ElementProps;
  contentProps?: ElementProps;
  trackXProps?: Pick<
    ScrollbarTrackProps,
    Exclude<keyof ScrollbarTrackProps, "axis">
  >;
  trackYProps?: Pick<
    ScrollbarTrackProps,
    Exclude<keyof ScrollbarTrackProps, "axis">
  >;
  thumbXProps?: Pick<
    ScrollbarThumbProps,
    Exclude<keyof ScrollbarThumbProps, "axis">
  >;
  thumbYProps?: Pick<
    ScrollbarThumbProps,
    Exclude<keyof ScrollbarThumbProps, "axis">
  >;

  onScroll?: (scrollValues: ScrollValues, instance: Scrollbar) => void;
};

export type ScrollbarState = {
  trackXVisible: boolean;
  trackYVisible: boolean;
  isRTL?: boolean;
};

export type ScrollbarContextValue = {
  parentScrollbar: Scrollbar | null;
};

export const ScrollbarContext: React.Context<
  ScrollbarContextValue
> = React.createContext({ parentScrollbar: null });

export default class Scrollbar extends React.Component<
  ScrollbarProps,
  ScrollbarState
> {
  static contextType = ScrollbarContext;

  /**
   * @description UUID identifying scrollbar instance
   */
  public readonly id: string;

  /**
   * @description Reference to the holder HTMLElement or null if it wasn't rendered or <i>native</i> property is true
   */
  public holderElement: HTMLElement | null;
  /**
   * @description Reference to the wrapper HTMLElement or null if it wasn't rendered or <i>native</i> property is true
   */
  public wrapperElement: HTMLElement | null;
  /**
   * @description Reference to the content HTMLElement that contains component's children (and has browser's scrollbars)
   */
  public contentElement: HTMLElement | null;
  /**
   * @description Reference to the horizontal track HTMLElement or null if it wasn't rendered
   */
  public trackXElement: HTMLElement | null;
  /**
   * @description Reference to the vertical track HTMLElement or null if it wasn't rendered
   */
  public trackYElement: HTMLElement | null;
  /**
   * @description Reference to the horizontal thumb HTMLElement or null if it wasn't rendered
   */
  public thumbXElement: HTMLElement | null;
  /**
   * @description Reference to the vertical thumb HTMLElement or null if it wasn't rendered
   */
  public thumbYElement: HTMLElement | null;

  static propTypes = {
    createContext: PropTypes.bool,
    rtl: PropTypes.bool,
    native: PropTypes.bool,
    momentum: PropTypes.bool,
    noDefaultStyles: PropTypes.bool,

    minimalThumbSize: PropTypes.number,
    maximalThumbSize: PropTypes.number,
    minimalThumbXSize: PropTypes.number,
    maximalThumbXSize: PropTypes.number,
    minimalThumbYSize: PropTypes.number,
    maximalThumbYSize: PropTypes.number,

    noScrollX: PropTypes.bool,
    noScrollY: PropTypes.bool,
    noScroll: PropTypes.bool,

    permanentTrackX: PropTypes.bool,
    permanentTrackY: PropTypes.bool,
    permanentTracks: PropTypes.bool,

    removeTracksWhenNotUsed: PropTypes.bool,
    removeTrackYWhenNotUsed: PropTypes.bool,
    removeTrackXWhenNotUsed: PropTypes.bool,

    trackClickBehavior: PropTypes.oneOf([
      SCROLLBAR_TRACK_CLICK_BEHAVIOR.JUMP,
      SCROLLBAR_TRACK_CLICK_BEHAVIOR.STEP
    ]),

    scrollbarWidth: PropTypes.number,
    fallbackScrollbarWidth: PropTypes.number,
    scrollTop: PropTypes.number,
    scrollLeft: PropTypes.number,

    className: PropTypes.string,

    wrapperProps: PropTypes.object,
    contentProps: PropTypes.object,
    trackXProps: PropTypes.object,
    trackYProps: PropTypes.object,
    thumbXProps: PropTypes.object,
    thumbYProps: PropTypes.object
  };

  static defaultProps = {
    createContext: false,
    native: false,
    momentum: true,
    noDefaultStyles: false,

    noScrollX: false,
    noScrollY: false,
    noScroll: false,

    permanentTrackX: false,
    permanentTrackY: false,
    permanentTracks: false,

    removeTracksWhenNotUsed: false,
    removeTrackYWhenNotUsed: false,
    removeTrackXWhenNotUsed: false,

    minimalThumbSize: 30,

    fallbackScrollbarWidth: 20,

    trackClickBehavior: SCROLLBAR_TRACK_CLICK_BEHAVIOR.JUMP,

    wrapperProps: {},
    contentProps: {},
    trackXProps: {},
    trackYProps: {},
    thumbXProps: {},
    thumbYProps: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      trackXVisible: false,
      trackYVisible: false,
      isRTL: this.props.rtl
    };

    this.scrollValues = this.getScrollValues(true);

    this.id = uuid();
  }

  public componentDidMount(): void {
    if (!this.contentElement) {
      this.setState(() => {
        throw new Error(
          "content element was not created. Possibly you haven't provided HTMLElement to renderer's `elementRef` function."
        );
      });
      return;
    }

    if (!this.props.native) {
      if (!this.holderElement) {
        this.setState(() => {
          throw new Error(
            "holder element was not created. Possibly you haven't provided HTMLElement to renderer's `elementRef` function."
          );
        });
        return;
      }

      if (!this.wrapperElement) {
        this.setState(() => {
          throw new Error(
            "wrapper element was not created. Possibly you haven't provided HTMLElement to renderer's `elementRef` function."
          );
        });
        return;
      }
    }

    Loop.addTarget(this);

    if (typeof this.props.scrollTop !== "undefined") {
      this.contentElement.scrollTop = this.props.scrollTop;
    }

    if (typeof this.props.scrollLeft !== "undefined") {
      this.contentElement.scrollLeft = this.props.scrollLeft;
    }

    this.update(true);
  }

  public componentWillUnmount(): void {
    Loop.removeTarget(this);
  }

  public componentDidUpdate(
    prevProps: Readonly<ScrollbarProps>,
    prevState: Readonly<ScrollbarState>
  ): void {
    if (!this.contentElement) {
      return;
    }

    if (
      this.props.rtl !== prevProps.rtl &&
      this.props.rtl !== this.state.isRTL
    ) {
      this.setState({ isRTL: this.props.rtl });
    }

    if (this.state.isRTL !== prevState.isRTL) {
      this.update();
    }

    if (
      typeof this.props.scrollTop !== "undefined" &&
      this.props.scrollTop !== this.contentElement.scrollTop
    ) {
      this.contentElement.scrollTop = this.props.scrollTop;
    }

    if (
      typeof this.props.scrollLeft !== "undefined" &&
      this.props.scrollLeft !== this.contentElement.scrollLeft
    ) {
      this.contentElement.scrollLeft = this.props.scrollLeft;
    }
  }

  /**
   * @description Current ScrollValues (cached)
   */
  private scrollValues: ScrollValues;

  /**
   * @description Get current scroll-related values.<br/>
   * If <i>force</i> if truthy - will recalculate them instead of returning cached values.
   *
   * @return ScrollValues
   */
  public getScrollValues = (force: boolean = false): ScrollValues => {
    if (this.scrollValues && !force) {
      return { ...this.scrollValues };
    }

    let scrollValues: ScrollValues = {
      clientHeight: 0,
      clientWidth: 0,
      scrollHeight: 0,
      scrollWidth: 0,
      scrollTop: 0,
      scrollLeft: 0,
      scrollYBlocked: false,
      scrollXBlocked: false,
      scrollYPossible: false,
      scrollXPossible: false,
      trackYVisible: false,
      trackXVisible: false,
      isRTL: undefined
    };

    scrollValues.isRTL = this.state.isRTL;

    scrollValues.scrollYBlocked = this.props.noScroll! || this.props.noScrollY!;
    scrollValues.scrollXBlocked = this.props.noScroll! || this.props.noScrollX!;

    if (this.contentElement) {
      scrollValues.clientHeight = this.contentElement.clientHeight;
      scrollValues.clientWidth = this.contentElement.clientWidth;

      scrollValues.scrollHeight = this.contentElement.scrollHeight;
      scrollValues.scrollWidth = this.contentElement.scrollWidth;
      scrollValues.scrollTop = this.contentElement.scrollTop;
      scrollValues.scrollLeft = this.contentElement.scrollLeft;

      scrollValues.scrollYPossible =
        !scrollValues.scrollYBlocked &&
        scrollValues.scrollHeight > scrollValues.clientHeight;
      scrollValues.scrollXPossible =
        !scrollValues.scrollXBlocked &&
        scrollValues.scrollWidth > scrollValues.clientWidth;

      scrollValues.trackYVisible =
        scrollValues.scrollYPossible ||
        this.props.permanentTracks! ||
        this.props.permanentTrackY!;
      scrollValues.trackXVisible =
        scrollValues.scrollXPossible ||
        this.props.permanentTracks! ||
        this.props.permanentTrackX!;
    }

    return scrollValues;
  };

  /**
   * @description Scroll to top border
   */
  public scrollToTop = (): this => {
    if (this.contentElement) {
      this.contentElement.scrollTop = 0;
    }

    return this;
  };
  /**
   * @description Scroll to left border
   */
  public scrollToLeft = (): this => {
    if (this.contentElement) {
      this.contentElement.scrollLeft = 0;
    }

    return this;
  };
  /**
   * @description Scroll to bottom border
   */
  public scrollToBottom = (): this => {
    if (this.contentElement) {
      this.contentElement.scrollTop =
        this.contentElement.scrollHeight - this.contentElement.clientHeight;
    }

    return this;
  };
  /**
   * @description Scroll to right border
   */
  public scrollToRight = (): this => {
    if (this.contentElement) {
      this.contentElement.scrollLeft =
        this.contentElement.scrollWidth - this.contentElement.clientWidth;
    }

    return this;
  };

  /**
   * @description Set the scrolls at given coordinates.<br/>
   * If coordinate is undefined - current scroll value will persist.
   */
  public scrollTo = (x?: number, y?: number): this => {
    if (this.contentElement) {
      typeof x === "number" && (this.contentElement.scrollLeft = x);
      typeof y === "number" && (this.contentElement.scrollTop = y);
    }

    return this;
  };

  /**
   * @description Center the viewport at given coordinates.<br/>
   * If coordinate is undefined - current scroll value will persist.
   */
  public centerAt = (x?: number, y?: number): this => {
    if (this.contentElement) {
      typeof x === "number" &&
        (this.contentElement.scrollLeft =
          x - this.contentElement.clientWidth / 2);
      typeof y === "number" &&
        (this.contentElement.scrollTop =
          y - this.contentElement.clientHeight / 2);
    }

    return this;
  };

  get scrollTop() {
    if (this.contentElement) {
      return this.contentElement.scrollTop;
    }

    return 0;
  }

  set scrollTop(top) {
    if (this.contentElement) {
      this.contentElement.scrollTop = top;
      this.update();
    }
  }

  get scrollLeft() {
    if (this.contentElement) {
      return this.contentElement.scrollLeft;
    }

    return 0;
  }

  set scrollLeft(left) {
    if (this.contentElement) {
      this.contentElement.scrollLeft = left;
    }
  }

  get scrollHeight() {
    if (this.contentElement) {
      return this.contentElement.scrollHeight;
    }

    return 0;
  }

  get scrollWidth() {
    if (this.contentElement) {
      return this.contentElement.scrollWidth;
    }

    return 0;
  }

  get clientHeight() {
    if (this.contentElement) {
      return this.contentElement.clientHeight;
    }

    return 0;
  }

  get clientWidth() {
    if (this.contentElement) {
      return this.contentElement.clientWidth;
    }

    return 0;
  }

  public update = (force = false): ScrollValues | void => {
    if (!this.contentElement) {
      return;
    }

    // autodetect direction if not defined
    if (typeof this.state.isRTL === "undefined") {
      this.setState({
        isRTL: getComputedStyle(this.contentElement).direction === "rtl"
      });

      return this.getScrollValues();
    }

    const scrollValues: ScrollValues = this.getScrollValues(true);

    let bitmask: number = 0;

    if (this.scrollValues && !force) {
      this.scrollValues.clientHeight !== scrollValues.clientHeight &&
        (bitmask |= 1 << 0);
      this.scrollValues.clientWidth !== scrollValues.clientWidth &&
        (bitmask |= 1 << 1);
      this.scrollValues.scrollHeight !== scrollValues.scrollHeight &&
        (bitmask |= 1 << 2);
      this.scrollValues.scrollWidth !== scrollValues.scrollWidth &&
        (bitmask |= 1 << 3);
      this.scrollValues.scrollTop !== scrollValues.scrollTop &&
        (bitmask |= 1 << 4);
      this.scrollValues.scrollLeft !== scrollValues.scrollLeft &&
        (bitmask |= 1 << 5);
      this.scrollValues.scrollYBlocked !== scrollValues.scrollYBlocked &&
        (bitmask |= 1 << 6);
      this.scrollValues.scrollXBlocked !== scrollValues.scrollXBlocked &&
        (bitmask |= 1 << 7);
      this.scrollValues.scrollYPossible !== scrollValues.scrollYPossible &&
        (bitmask |= 1 << 8);
      this.scrollValues.scrollXPossible !== scrollValues.scrollXPossible &&
        (bitmask |= 1 << 9);
      this.scrollValues.trackYVisible !== scrollValues.trackYVisible &&
        (bitmask |= 1 << 10);
      this.scrollValues.trackXVisible !== scrollValues.trackXVisible &&
        (bitmask |= 1 << 11);
      this.scrollValues.isRTL !== scrollValues.isRTL && (bitmask |= 1 << 12);

      // if not forced and nothing has changed - skip this update
      if (bitmask === 0) {
        return this.scrollValues;
      }
    } else {
      bitmask = 0b1111111111111;
    }

    // if scrollbars visibility has changed
    if (bitmask & (1 << 10) || bitmask & (1 << 11)) {
      this.scrollValues.scrollYBlocked = scrollValues.scrollYBlocked;
      this.scrollValues.scrollXBlocked = scrollValues.scrollXBlocked;
      this.scrollValues.scrollYPossible = scrollValues.scrollYPossible;
      this.scrollValues.scrollXPossible = scrollValues.scrollXPossible;

      if (this.trackYElement && bitmask & (1 << 10)) {
        this.trackYElement.style.display = scrollValues.trackYVisible
          ? null
          : "none";
      }

      if (this.trackXElement && bitmask & (1 << 11)) {
        this.trackXElement.style.display = scrollValues.trackXVisible
          ? null
          : "none";
      }

      this.setState({
        trackYVisible: (this.scrollValues.trackYVisible =
          scrollValues.trackYVisible)!,
        trackXVisible: (this.scrollValues.trackXVisible =
          scrollValues.trackXVisible)!
      });

      return;
    }

    (this.props.native ? this.updaterNative : this.updaterCustom)(
      bitmask,
      scrollValues
    );

    this.scrollValues = scrollValues;

    if (
      typeof this.props.onScroll === "function" &&
      (bitmask & (1 << 4) || bitmask & (1 << 5))
    ) {
      this.props.onScroll(scrollValues, this);
    }

    return this.scrollValues;
  };

  private updaterNative = (): boolean => {
    // just for future
    return true;
  };

  private updaterCustom = (
    bitmask: number,
    scrollValues: ScrollValues
  ): boolean => {
    if (this.trackYElement) {
      if (
        this.thumbYElement &&
        (bitmask & (1 << 0) ||
          bitmask & (1 << 2) ||
          bitmask & (1 << 4) ||
          bitmask & (1 << 6) ||
          bitmask & (1 << 8))
      ) {
        if (scrollValues.scrollYPossible) {
          const trackInnerSize = getInnerHeight(this.trackYElement);
          const thumbSize = calcThumbSize(
            scrollValues.scrollHeight,
            scrollValues.clientHeight,
            trackInnerSize,
            this.props.minimalThumbYSize || this.props.minimalThumbSize,
            this.props.maximalThumbYSize || this.props.maximalThumbSize
          );
          const thumbOffset = calcThumbOffset(
            scrollValues.scrollHeight,
            scrollValues.clientHeight,
            trackInnerSize,
            thumbSize,
            scrollValues.scrollTop
          );

          this.thumbYElement.style.transform = `translateY(${thumbOffset}px)`;
          this.thumbYElement.style.height = thumbSize + "px";
          this.thumbYElement.style.display = null;
        } else {
          this.thumbYElement.style.transform = null;
          this.thumbYElement.style.height = "0px";
          this.thumbYElement.style.display = "none";
        }
      }
    }

    if (this.trackXElement) {
      if (
        this.thumbXElement &&
        (bitmask & (1 << 1) ||
          bitmask & (1 << 3) ||
          bitmask & (1 << 5) ||
          bitmask & (1 << 7) ||
          bitmask & (1 << 9) ||
          bitmask & (1 << 12))
      ) {
        if (scrollValues.scrollXPossible) {
          const trackInnerSize = getInnerWidth(this.trackXElement);
          const thumbSize = calcThumbSize(
            scrollValues.scrollWidth,
            scrollValues.clientWidth,
            trackInnerSize,
            this.props.minimalThumbXSize || this.props.minimalThumbSize,
            this.props.maximalThumbXSize || this.props.maximalThumbSize
          );
          let thumbOffset = calcThumbOffset(
            scrollValues.scrollWidth,
            scrollValues.clientWidth,
            trackInnerSize,
            thumbSize,
            scrollValues.scrollLeft
          );

          if (reverseRTL) {
            thumbOffset += trackInnerSize - thumbSize;
          }

          this.thumbXElement.style.transform = `translateX(${thumbOffset}px)`;
          this.thumbXElement.style.width = thumbSize + "px";
          this.thumbXElement.style.display = null;
        } else {
          this.thumbXElement.style.transform = null;
          this.thumbXElement.style.width = "0px";
          this.thumbXElement.style.display = "none";
        }
      }
    }

    return true;
  };

  private elementRefHolder = (ref: HTMLElement | null) => {
    this.holderElement = ref;
    typeof this.props.elementRef === "function" && this.props.elementRef(ref);
  };

  private elementRefWrapper = (ref: HTMLElement | null) => {
    this.wrapperElement = ref;
    typeof this.props.wrapperProps!.elementRef === "function" &&
      this.props.wrapperProps!.elementRef(ref);
  };

  private elementRefContent = (ref: HTMLElement | null) => {
    this.contentElement = ref;
    typeof this.props.contentProps!.elementRef === "function" &&
      this.props.contentProps!.elementRef(ref);
  };

  private elementRefTrackX = (ref: HTMLElement | null) => {
    this.trackXElement = ref;
    typeof this.props.trackXProps!.elementRef === "function" &&
      this.props.trackXProps!.elementRef(ref);
  };
  private elementRefTrackY = (ref: HTMLElement | null) => {
    this.trackYElement = ref;
    typeof this.props.trackYProps!.elementRef === "function" &&
      this.props.trackYProps!.elementRef(ref);
  };

  private elementRefThumbX = (ref: HTMLElement | null) => {
    this.thumbXElement = ref;
    typeof this.props.thumbXProps!.elementRef === "function" &&
      this.props.thumbXProps!.elementRef(ref);
  };
  private elementRefThumbY = (ref: HTMLElement | null) => {
    this.thumbYElement = ref;
    typeof this.props.thumbYProps!.elementRef === "function" &&
      this.props.thumbYProps!.elementRef(ref);
  };

  private handleTrackXClick = (
    ev: MouseEvent,
    values: ScrollbarTrackClickParameters
  ): void => {
    this.props.trackXProps!.onClick &&
      this.props.trackXProps!.onClick!(ev, values);

    if (
      !this.contentElement ||
      !this.trackXElement ||
      !this.thumbXElement ||
      !this.scrollValues ||
      !this.scrollValues.scrollXPossible
    ) {
      return;
    }

    const thumbSize = this.thumbXElement.clientWidth;
    const trackInnerSize = getInnerWidth(this.trackXElement);
    const thumbOffset =
      (this.scrollValues.isRTL && reverseRTL
        ? values.offset + thumbSize / 2 - trackInnerSize
        : values.offset - thumbSize / 2) -
      //@ts-ignore
      (parseFloat(getComputedStyle(this.trackXElement).paddingLeft) || 0);

    let target = calcScrollForThumbOffset(
      this.scrollValues.scrollWidth,
      this.scrollValues.clientWidth,
      trackInnerSize,
      thumbSize,
      thumbOffset
    );

    if (this.props.trackClickBehavior === SCROLLBAR_TRACK_CLICK_BEHAVIOR.STEP) {
      target = (this.scrollValues.isRTL
      ? this.scrollValues.scrollLeft > target
      : this.scrollValues.scrollLeft < target)
        ? this.scrollValues.scrollLeft + this.scrollValues.clientWidth
        : this.scrollValues.scrollLeft - this.scrollValues.clientWidth;
    }

    this.contentElement.scrollLeft = target;
  };

  private handleTrackYClick = (
    ev: MouseEvent,
    values: ScrollbarTrackClickParameters
  ): void => {
    this.props.trackYProps!.onClick &&
      this.props.trackYProps!.onClick!(ev, values);

    if (
      !this.contentElement ||
      !this.trackYElement ||
      !this.thumbYElement ||
      !this.scrollValues ||
      !this.scrollValues.scrollYPossible
    ) {
      return;
    }

    const thumbSize = this.thumbYElement!.clientHeight;
    let target =
      calcScrollForThumbOffset(
        this.scrollValues.scrollHeight,
        this.scrollValues.clientHeight,
        getInnerHeight(this.trackYElement),
        thumbSize,
        values.offset - thumbSize / 2
      ) -
      //@ts-ignore
      (parseFloat(getComputedStyle(this.trackYElement).paddingTop) || 0);

    if (this.props.trackClickBehavior === SCROLLBAR_TRACK_CLICK_BEHAVIOR.JUMP) {
      this.contentElement.scrollTop = target;
    } else {
      this.contentElement.scrollTop =
        this.scrollValues.scrollTop < target
          ? this.scrollValues.scrollTop + this.scrollValues.clientHeight
          : this.scrollValues.scrollTop - this.scrollValues.clientHeight;
    }
  };

  private handleTrackYMouseWheel = (ev: React.WheelEvent<HTMLElement>) => {
    this.props.trackYProps &&
      this.props.trackYProps.onWheel &&
      this.props.trackYProps.onWheel(ev);

    if (!this.contentElement || this.scrollValues.scrollYBlocked) {
      return;
    }

    this.scrollTop += ev.deltaY;
  };

  private handleTrackXMouseWheel = (ev: React.WheelEvent<HTMLElement>) => {
    this.props.trackXProps &&
      this.props.trackXProps.onWheel &&
      this.props.trackXProps.onWheel(ev);

    if (!this.contentElement || this.scrollValues.scrollXBlocked) {
      return;
    }

    this.scrollLeft += ev.deltaX;
  };

  private handleThumbXDrag = (data: DraggableData): void => {
    if (
      !this.trackXElement ||
      !this.thumbXElement ||
      !this.contentElement ||
      !this.scrollValues ||
      !this.scrollValues.scrollXPossible
    ) {
      return;
    }

    const trackRect: ClientRect = this.trackXElement.getBoundingClientRect();
    const styles: CSSStyleDeclaration = getComputedStyle(this.trackXElement);
    //@ts-ignore
    const paddingLeft: number = parseFloat(styles.paddingLeft) || 0;
    //@ts-ignore
    const paddingRight: number = parseFloat(styles.paddingRight) || 0;
    const trackInnerSize = trackRect.width - paddingLeft - paddingRight;
    const thumbSize = this.thumbXElement.clientWidth;
    const offset =
      this.scrollValues.isRTL && reverseRTL
        ? data.x + thumbSize - trackInnerSize + paddingLeft
        : data.lastX - paddingLeft;

    this.contentElement.scrollLeft = calcScrollForThumbOffset(
      this.scrollValues.scrollWidth,
      this.scrollValues.clientWidth,
      trackInnerSize,
      thumbSize,
      offset
    );
  };
  private handleThumbYDrag = (data: DraggableData): void => {
    if (
      !this.contentElement ||
      !this.trackYElement ||
      !this.thumbYElement ||
      !this.scrollValues ||
      !this.scrollValues.scrollYPossible
    ) {
      return;
    }

    const trackRect: ClientRect = this.trackYElement.getBoundingClientRect();
    const styles: CSSStyleDeclaration = getComputedStyle(this.trackYElement);
    //@ts-ignore
    const paddingTop: number = parseFloat(styles.paddingTop) || 0;
    //@ts-ignore
    const paddingBottom: number = parseFloat(styles.paddingBottom) || 0;
    const trackInnerSize = trackRect.height - paddingTop - paddingBottom;
    const thumbSize = this.thumbYElement.clientHeight;
    const offset = data.y - paddingTop;

    this.contentElement.scrollTop = calcScrollForThumbOffset(
      this.scrollValues.scrollHeight,
      this.scrollValues.clientHeight,
      trackInnerSize,
      thumbSize,
      offset
    );
  };

  public render(): React.ReactElement<any> | null {
    const {
      createContext,
      rtl,
      native,
      momentum,
      noDefaultStyles,

      noScrollX,
      noScrollY,
      noScroll,

      permanentTrackX,
      permanentTrackY,
      permanentTracks,

      removeTracksWhenNotUsed,
      removeTrackYWhenNotUsed,
      removeTrackXWhenNotUsed,

      minimalThumbSize,
      maximalThumbSize,
      minimalThumbXSize,
      maximalThumbXSize,
      minimalThumbYSize,
      maximalThumbYSize,

      fallbackScrollbarWidth,

      trackClickBehavior,

      wrapperProps: propsWrapperProps,
      contentProps: propsContentProps,
      trackXProps: propsTrackXProps,
      trackYProps: propsTrackYProps,
      thumbXProps: propsThumbXProps,
      thumbYProps: propsThumbYProps,

      scrollbarWidth: propsScrollbarWidth,

      elementRef,
      renderer,

      onScroll,

      children,

      ...props
    } = this.props;

    if (native) {
      this.elementRefHolder(null);
      this.elementRefWrapper(null);
      this.elementRefTrackX(null);
      this.elementRefTrackY(null);
      this.elementRefThumbX(null);
      this.elementRefThumbY(null);

      return (
        <div
          key="ScrollbarCustom"
          className={cnb(
            "ScrollbarsCustom native",
            {
              trackYVisible: this.state.trackYVisible,
              trackXVisible: this.state.trackXVisible,
              rtl: this.state.isRTL
            },
            this.props.className
          )}
          style={{
            ...this.props.style,
            ...(rtl && { direction: "rtl" }),
            ...(momentum && { WebkitOverflowScrolling: "touch" }),
            overflowX:
              noScroll || noScrollX
                ? "hidden"
                : permanentTracks || permanentTrackX
                ? "scroll"
                : "auto",
            overflowY:
              noScroll || noScrollY
                ? "hidden"
                : permanentTracks || permanentTrackY
                ? "scroll"
                : "auto"
          }}
          children={children}
          ref={this.elementRefContent}
        />
      );
    }

    const styles = Scrollbar.calculateStyles(
      this.props,
      this.state,
      this.scrollValues,
      typeof propsScrollbarWidth !== "undefined"
        ? propsScrollbarWidth
        : getScrollbarWidth()
    );

    const contentProps = {
      ...propsContentProps,
      key: "ScrollbarCustom-content",
      className: cnb("ScrollbarContent", propsContentProps!.className),
      style: styles.content,
      [propsContentProps!.renderer ? "elementRef" : "ref"]: this
        .elementRefContent,
      [propsContentProps!.renderer ? "ref" : "elementRef"]: undefined,
      children: createContext ? (
        <ScrollbarContext.Provider value={{ parentScrollbar: this }}>
          {children}
        </ScrollbarContext.Provider>
      ) : (
        children
      )
    } as ElementProps<HTMLDivElement>;

    const wrapperProps = {
      ...propsWrapperProps,
      key: "ScrollbarCustom-wrapper",
      className: cnb("ScrollbarWrapper", propsWrapperProps!.className),
      style: styles.wrapper,
      [propsWrapperProps!.renderer ? "elementRef" : "ref"]: this
        .elementRefWrapper,
      [propsWrapperProps!.renderer ? "ref" : "elementRef"]: undefined,
      children: propsContentProps!.renderer ? (
        propsContentProps!.renderer(contentProps)
      ) : (
        <div {...contentProps} />
      )
    } as ElementProps<HTMLDivElement>;

    const holderProps = {
      ...props,
      key: "ScrollbarCustom-holder_" + this.id,
      className: cnb(
        "ScrollbarsCustom",
        {
          trackYVisible: this.state.trackYVisible,
          trackXVisible: this.state.trackXVisible,
          rtl: this.state.isRTL
        },
        this.props.className
      ),
      style: styles.holder,
      [renderer ? "elementRef" : "ref"]: this.elementRefHolder,
      [renderer ? "ref" : "elementRef"]: undefined
    } as ElementProps<HTMLDivElement>;

    const holderChildren = [
      propsWrapperProps!.renderer ? (
        propsWrapperProps!.renderer(wrapperProps)
      ) : (
        <div {...wrapperProps} />
      )
    ];

    if (
      this.state.trackYVisible ||
      (!removeTracksWhenNotUsed && !removeTrackYWhenNotUsed)
    ) {
      const thumbYProps = {
        ...propsThumbYProps,
        key: "ScrollbarCustom-thumbY",
        style: styles.thumbY,
        elementRef: this.elementRefThumbY,
        onDrag: this.handleThumbYDrag,
        onDragEnd: this.handleThumbYDrag
      } as ScrollbarThumbProps;

      const trackYProps = {
        ...propsTrackYProps,
        key: "ScrollbarCustom-trackY",
        style: styles.trackY,
        elementRef: this.elementRefTrackY,
        onClick: this.handleTrackYClick,
        onWheel: this.handleTrackYMouseWheel,
        children: (
          <ScrollbarThumb
            axis={DIRECTION_AXIS.Y}
            {...thumbYProps}
            ref={undefined}
          />
        )
      } as ScrollbarTrackProps;

      holderChildren.push(
        <ScrollbarTrack
          axis={DIRECTION_AXIS.Y}
          {...trackYProps}
          ref={undefined}
        />
      );
    } else {
      this.elementRefTrackY(null);
      this.elementRefThumbY(null);
    }

    if (
      this.state.trackXVisible ||
      (!removeTracksWhenNotUsed && !removeTrackXWhenNotUsed)
    ) {
      const thumbXProps = {
        ...propsThumbXProps,
        key: "ScrollbarCustom-thumbX",
        style: styles.thumbX,
        elementRef: this.elementRefThumbX,
        onDrag: this.handleThumbXDrag,
        onDragEnd: this.handleThumbXDrag
      } as ScrollbarThumbProps;

      const trackXProps = {
        ...propsTrackXProps,
        key: "ScrollbarCustom-trackX",
        style: styles.trackX,
        elementRef: this.elementRefTrackX,
        onClick: this.handleTrackXClick,
        onWheel: this.handleTrackXMouseWheel,
        children: (
          <ScrollbarThumb
            axis={DIRECTION_AXIS.X}
            {...thumbXProps}
            ref={undefined}
          />
        )
      } as ScrollbarTrackProps;

      holderChildren.push(
        <ScrollbarTrack
          axis={DIRECTION_AXIS.X}
          {...trackXProps}
          ref={undefined}
        />
      );
    } else {
      this.elementRefTrackX(null);
      this.elementRefThumbX(null);
    }

    holderProps.children = holderChildren;

    return renderer ? renderer(holderProps) : <div {...holderProps} />;
  }

  public static calculateStyles(
    props: ScrollbarProps,
    state: ScrollbarState,
    scrollValues,
    scrollbarWidth: number
  ): { [key: string]: React.CSSProperties } {
    const useDefaultStyles = !props.noDefaultStyles;

    return {
      holder: {
        ...(useDefaultStyles && defaultStyles.holder),
        ...props.style
      },
      wrapper: {
        ...(useDefaultStyles && {
          ...defaultStyles.wrapper,
          [state.isRTL ? "left" : "right"]: state.trackYVisible ? 10 : 0,
          bottom: state.trackXVisible ? 10 : 0
        }),
        ...props.wrapperProps!.style,
        position: "absolute",
        overflow: "hidden"
      },
      content: {
        ...(useDefaultStyles && defaultStyles.content),
        ...props.contentProps!.style,

        ...(typeof props.rtl !== "undefined" && {
          direction: props.rtl ? "rtl" : "ltr"
        }),

        ...(props.momentum && { WebkitOverflowScrolling: "touch" }),

        overflowY: scrollValues.scrollYPossible ? "scroll" : "hidden",
        overflowX: scrollValues.scrollXPossible ? "scroll" : "hidden",

        paddingBottom:
          !scrollbarWidth && scrollValues.scrollXPossible
            ? props.fallbackScrollbarWidth
            : undefined,
        marginBottom: scrollValues.scrollXPossible
          ? -(scrollbarWidth || props.fallbackScrollbarWidth!)
          : undefined,

        [state.isRTL ? "paddingLeft" : "paddingRight"]:
          !scrollbarWidth && scrollValues.scrollYPossible
            ? props.fallbackScrollbarWidth
            : undefined,
        [state.isRTL
          ? "marginLeft"
          : "marginRight"]: scrollValues.scrollYPossible
          ? -(scrollbarWidth || props.fallbackScrollbarWidth!)
          : undefined
      },
      trackX: {
        ...(useDefaultStyles && defaultStyles.track.common),
        ...(useDefaultStyles && defaultStyles.track.x),
        ...props.trackXProps!.style,
        ...(!state.trackXVisible && { display: "none" })
      },
      trackY: {
        ...(useDefaultStyles && defaultStyles.track.common),
        ...(useDefaultStyles && defaultStyles.track.y),
        ...props.trackYProps!.style,
        [state.isRTL ? "left" : "right"]: 0,
        ...(!state.trackYVisible && { display: "none" })
      },
      thumbX: {
        ...(useDefaultStyles && defaultStyles.thumb.common),
        ...(useDefaultStyles && defaultStyles.thumb.x),
        ...props.thumbXProps!.style
      },
      thumbY: {
        ...(useDefaultStyles && defaultStyles.thumb.common),
        ...(useDefaultStyles && defaultStyles.thumb.y),
        ...props.thumbYProps!.style
      }
    };
  }
}

const defaultStyles = {
  holder: {
    position: "relative",
    width: "100%",
    height: "100%"
  } as React.CSSProperties,
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  } as React.CSSProperties,
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  } as React.CSSProperties,
  track: {
    common: {
      position: "absolute",
      overflow: "hidden",
      borderRadius: 4,
      background: "rgba(0,0,0,.1)",
      userSelect: "none"
    } as React.CSSProperties,
    x: {
      height: 10,
      width: "calc(100% - 20px)",
      bottom: 0,
      left: 10
    } as React.CSSProperties,
    y: {
      width: 10,
      height: "calc(100% - 20px)",
      top: 10
    } as React.CSSProperties
  },
  thumb: {
    common: {
      cursor: "pointer",
      borderRadius: 4,
      background: "rgba(0,0,0,.4)"
    } as React.CSSProperties,
    x: {
      height: "100%",
      width: 0
    } as React.CSSProperties,
    y: {
      width: "100%",
      height: 0
    } as React.CSSProperties
  }
};
