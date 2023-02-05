import { cnb } from 'cnbuilder';
import * as React from 'react';
import { DraggableData } from 'react-draggable';
import { zoomLevel } from 'zoom-level';
import Emittr from './Emittr';
import Loop from './Loop';
import ScrollbarThumb, { ScrollbarThumbProps } from './ScrollbarThumb';
import ScrollbarTrack, {
  ScrollbarTrackClickParameters,
  ScrollbarTrackProps,
} from './ScrollbarTrack';
import defaultStyle from './style';
import {
  AXIS_DIRECTION,
  ElementPropsWithElementRefAndRenderer,
  ScrollState,
  TRACK_CLICK_BEHAVIOR,
} from './types';
import * as util from './util';
import { isBrowser, renderDivWithRenderer } from './util';

let pageZoomLevel: number = isBrowser ? zoomLevel() : 1;
if (isBrowser) {
  window.addEventListener(
    'resize',
    () => {
      pageZoomLevel = zoomLevel();
    },
    { passive: true }
  );
}

export type ScrollbarProps = ElementPropsWithElementRefAndRenderer & {
  createContext?: boolean;

  rtl?: boolean;

  momentum?: boolean;
  native?: boolean;
  mobileNative?: boolean;

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
  scrollDetectionThreshold?: number;

  translateContentSizesToHolder?: boolean;
  translateContentSizeYToHolder?: boolean;
  translateContentSizeXToHolder?: boolean;

  noDefaultStyles?: boolean;

  disableTracksMousewheelScrolling?: boolean;
  disableTrackXMousewheelScrolling?: boolean;
  disableTrackYMousewheelScrolling?: boolean;

  disableTracksWidthCompensation?: boolean;
  disableTrackXWidthCompensation?: boolean;
  disableTrackYWidthCompensation?: boolean;

  trackClickBehavior?: TRACK_CLICK_BEHAVIOR;

  wrapperProps?: ElementPropsWithElementRefAndRenderer;
  scrollerProps?: ElementPropsWithElementRefAndRenderer;
  contentProps?: ElementPropsWithElementRefAndRenderer;

  trackXProps?: Pick<ScrollbarTrackProps, Exclude<keyof ScrollbarTrackProps, 'axis'>>;
  trackYProps?: Pick<ScrollbarTrackProps, Exclude<keyof ScrollbarTrackProps, 'axis'>>;

  thumbXProps?: Pick<ScrollbarThumbProps, Exclude<keyof ScrollbarThumbProps, 'axis'>>;
  thumbYProps?: Pick<ScrollbarThumbProps, Exclude<keyof ScrollbarThumbProps, 'axis'>>;

  onUpdate?: (scrollValues: ScrollState, prevScrollState: ScrollState) => void;
  onScroll?: (scrollValues: ScrollState, prevScrollState: ScrollState) => void;
  onScrollStart?: (scrollValues: ScrollState) => void;
  onScrollStop?: (scrollValues: ScrollState) => void;
};

export type ScrollbarState = {
  trackXVisible: boolean;
  trackYVisible: boolean;
  isRTL?: boolean;
};

export type ScrollbarContextValue = { parentScrollbar: Scrollbar | null };

export const ScrollbarContext: React.Context<ScrollbarContextValue> = React.createContext({
  parentScrollbar: null,
} as ScrollbarContextValue);

export default class Scrollbar extends React.Component<
  React.PropsWithChildren<ScrollbarProps>,
  ScrollbarState
> {
  // eslint-disable-next-line react/static-property-placement
  static contextType = ScrollbarContext;

  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    momentum: true,

    minimalThumbSize: 30,

    fallbackScrollbarWidth: 20,

    trackClickBehavior: TRACK_CLICK_BEHAVIOR.JUMP,

    scrollDetectionThreshold: 100,

    wrapperProps: {},
    scrollerProps: {},
    contentProps: {},
    trackXProps: {},
    trackYProps: {},
    thumbXProps: {},
    thumbYProps: {},
  };

  /**
   * @description UUID identifying scrollbar instance
   */
  public readonly id: string;

  /**
   * @description Reference to the holder HTMLDivElement or null if it wasn't rendered or <i>native</i> property is true
   */
  public holderElement: HTMLDivElement | null;

  /**
   * @description Reference to the wrapper HTMLDivElement or null if it wasn't rendered or <i>native</i> property is true
   */
  public wrapperElement: HTMLDivElement | null;

  /**
   * @description Reference to the HTMLDivElement that actually has browser's scrollbars
   */
  public scrollerElement: HTMLDivElement | null;

  /**
   * @description Reference to the content HTMLDivElement that contains component's children (and has browser's scrollbars)
   */
  public contentElement: HTMLDivElement | null;

  /**
   * @description Reference to the horizontal track HTMLDivElement or null if it wasn't rendered
   */
  public trackXElement: HTMLDivElement | null;

  /**
   * @description Reference to the vertical track HTMLDivElement or null if it wasn't rendered
   */
  public trackYElement: HTMLDivElement | null;

  /**
   * @description Reference to the horizontal thumb HTMLDivElement or null if it wasn't rendered
   */
  public thumbXElement: HTMLDivElement | null;

  /**
   * @description Reference to the vertical thumb HTMLDivElement or null if it wasn't rendered
   */
  public thumbYElement: HTMLDivElement | null;

  public readonly eventEmitter: Emittr;

  /**
   * @description Current ScrollState (cached)
   */
  private scrollValues: ScrollState;

  private _scrollDetectionTO: number | null;

  constructor(props) {
    super(props);

    this.state = {
      trackXVisible: false,
      trackYVisible: false,
      isRTL: props.rtl,
    };

    this.scrollValues = this.getScrollState(true);

    this.eventEmitter = new Emittr(15);

    if (props.onUpdate) this.eventEmitter.on('update', props.onUpdate);
    if (props.onScroll) this.eventEmitter.on('scroll', props.onScroll);
    if (props.onScrollStart) this.eventEmitter.on('scrollStart', props.onScrollStart);
    if (props.onScrollStop) this.eventEmitter.on('scrollStop', props.onScrollStop);

    this.id = util.uuid();
  }

  // eslint-disable-next-line react/sort-comp
  get scrollTop() {
    if (this.scrollerElement) {
      return this.scrollerElement.scrollTop;
    }

    return 0;
  }

  set scrollTop(top) {
    if (this.scrollerElement) {
      this.scrollerElement.scrollTop = top;
      this.update();
    }
  }

  get scrollLeft() {
    if (this.scrollerElement) {
      return this.scrollerElement.scrollLeft;
    }

    return 0;
  }

  set scrollLeft(left) {
    if (this.scrollerElement) {
      this.scrollerElement.scrollLeft = left;
    }
  }

  get scrollHeight() {
    if (this.scrollerElement) {
      return this.scrollerElement.scrollHeight;
    }

    return 0;
  }

  get scrollWidth() {
    if (this.scrollerElement) {
      return this.scrollerElement.scrollWidth;
    }

    return 0;
  }

  get clientHeight() {
    if (this.scrollerElement) {
      return this.scrollerElement.clientHeight;
    }

    return 0;
  }

  get clientWidth() {
    if (this.scrollerElement) {
      return this.scrollerElement.clientWidth;
    }

    return 0;
  }

  // eslint-disable-next-line react/sort-comp
  public static calculateStyles(
    props: ScrollbarProps,
    state: ScrollbarState,
    scrollValues,
    scrollbarWidth: number
  ) {
    const useDefaultStyles = !props.noDefaultStyles;

    return {
      holder: {
        ...(useDefaultStyles && defaultStyle.holder),
        position: 'relative',
        ...props.style,
      } as React.CSSProperties,
      wrapper: {
        ...(useDefaultStyles && {
          ...defaultStyle.wrapper,
          ...(!props.disableTracksWidthCompensation &&
            !props.disableTrackYWidthCompensation && {
              [state.isRTL ? 'left' : 'right']: state.trackYVisible ? 10 : 0,
            }),
          ...(!props.disableTracksWidthCompensation &&
            !props.disableTrackXWidthCompensation && {
              bottom: state.trackXVisible ? 10 : 0,
            }),
        }),
        ...props.wrapperProps!.style,
        position: 'absolute',
        overflow: 'hidden',
      } as React.CSSProperties,
      content: {
        ...(useDefaultStyles && defaultStyle.content),
        ...(props.translateContentSizesToHolder ||
        props.translateContentSizeYToHolder ||
        props.translateContentSizeXToHolder
          ? {
              display: 'table-cell',
            }
          : {
              padding: 0.05, // needed to disable margin collapsing without flexboxes, other possible solutions here: https://stackoverflow.com/questions/19718634/how-to-disable-margin-collapsing
            }),
        ...(useDefaultStyles &&
          !(props.translateContentSizesToHolder || props.translateContentSizeYToHolder) && {
            minHeight: '100%',
          }),
        ...(useDefaultStyles &&
          !(props.translateContentSizesToHolder || props.translateContentSizeXToHolder) && {
            minWidth: '100%',
          }),
        ...props.contentProps!.style,
      } as React.CSSProperties,
      scroller: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,

        paddingBottom:
          !scrollbarWidth && scrollValues.scrollXPossible
            ? props.fallbackScrollbarWidth
            : undefined,

        [state.isRTL ? 'paddingLeft' : 'paddingRight']:
          !scrollbarWidth && scrollValues.scrollYPossible
            ? props.fallbackScrollbarWidth
            : undefined,

        ...props.scrollerProps!.style,

        ...(!util.isUndef(props.rtl) && {
          direction: props.rtl ? 'rtl' : 'ltr',
        }),

        ...(props.momentum && { WebkitOverflowScrolling: 'touch' }),

        overflowY: scrollValues.scrollYPossible ? 'scroll' : 'hidden',
        overflowX: scrollValues.scrollXPossible ? 'scroll' : 'hidden',

        marginBottom: scrollValues.scrollXPossible
          ? -(scrollbarWidth || props.fallbackScrollbarWidth!) -
            Number(scrollValues.zoomLevel !== 1)
          : undefined,
        [state.isRTL ? 'marginLeft' : 'marginRight']: scrollValues.scrollYPossible
          ? -(scrollbarWidth || props.fallbackScrollbarWidth!) -
            Number(scrollValues.zoomLevel !== 1)
          : undefined,
      } as React.CSSProperties,
      trackX: {
        ...(useDefaultStyles && defaultStyle.track.common),
        ...(useDefaultStyles && defaultStyle.track.x),
        ...props.trackXProps!.style,
        ...(!state.trackXVisible && { display: 'none' }),
      } as React.CSSProperties,
      trackY: {
        ...(useDefaultStyles && defaultStyle.track.common),
        ...(useDefaultStyles && defaultStyle.track.y),
        ...(useDefaultStyles && { [state.isRTL ? 'left' : 'right']: 0 }),
        ...props.trackYProps!.style,
        ...(!state.trackYVisible && { display: 'none' }),
      } as React.CSSProperties,
      thumbX: {
        ...(useDefaultStyles && defaultStyle.thumb.common),
        ...(useDefaultStyles && defaultStyle.thumb.x),
        ...props.thumbXProps!.style,
      } as React.CSSProperties,
      thumbY: {
        ...(useDefaultStyles && defaultStyle.thumb.common),
        ...(useDefaultStyles && defaultStyle.thumb.y),
        ...props.thumbYProps!.style,
      } as React.CSSProperties,
    };
  }

  public componentDidMount(): void {
    if (!this.scrollerElement) {
      this.setState(() => {
        throw new Error(
          "scroller element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function."
        );
      });
      return;
    }

    if (!this.contentElement) {
      this.setState(() => {
        throw new Error(
          "content element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function."
        );
      });
      return;
    }

    const { props } = this;

    if (!props.native && !props.mobileNative) {
      // ToDo: move native state to the state so it can be synchronized
      if (!this.holderElement) {
        this.setState(() => {
          throw new Error(
            "holder element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function."
          );
        });
        return;
      }

      if (!this.wrapperElement) {
        this.setState(() => {
          throw new Error(
            "wrapper element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function."
          );
        });
        return;
      }
    }

    Loop.addTarget(this);

    if (!util.isUndef(props.scrollTop)) {
      this.scrollerElement.scrollTop = props.scrollTop!;
    }

    if (!util.isUndef(props.scrollLeft)) {
      this.scrollerElement.scrollLeft = props.scrollLeft!;
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
    if (!this.scrollerElement) {
      return;
    }

    const { props } = this;

    if (props.rtl !== prevProps.rtl && props.rtl !== this.state.isRTL) {
      this.setState({ isRTL: props.rtl });
    }

    if (this.state.isRTL !== prevState.isRTL) {
      this.update();
    }

    if (!util.isUndef(props.scrollTop) && props.scrollTop !== this.scrollerElement.scrollTop) {
      this.scrollerElement.scrollTop = props.scrollTop!;
    }

    if (!util.isUndef(props.scrollLeft) && props.scrollLeft !== this.scrollerElement.scrollLeft) {
      this.scrollerElement.scrollLeft = props.scrollLeft!;
    }

    if (prevProps.onUpdate !== props.onUpdate) {
      if (prevProps.onUpdate) this.eventEmitter.off('update', prevProps.onUpdate);
      if (props.onUpdate) this.eventEmitter.on('update', props.onUpdate);
    }

    if (prevProps.onScroll !== props.onScroll) {
      if (prevProps.onScroll) this.eventEmitter.off('scroll', prevProps.onScroll);
      if (props.onScroll) this.eventEmitter.on('scroll', props.onScroll);
    }

    if (prevProps.onScrollStart !== props.onScrollStart) {
      if (prevProps.onScrollStart) this.eventEmitter.off('scrollStart', prevProps.onScrollStart);
      if (props.onScrollStart) this.eventEmitter.on('scrollStart', props.onScrollStart);
    }

    if (prevProps.onScrollStop !== props.onScrollStop) {
      if (prevProps.onScrollStop) this.eventEmitter.off('scrollStop', prevProps.onScrollStop);
      if (props.onScrollStop) this.eventEmitter.on('scrollStop', props.onScrollStop);
    }
  }

  /**
   * @description Get current scroll-related values.<br/>
   * If <i>force</i> if truthy - will recalculate them instead of returning cached values.
   *
   * @return ScrollState
   */
  public getScrollState = (force = false): ScrollState => {
    if (this.scrollValues && !force) {
      return { ...this.scrollValues };
    }

    const scrollState: ScrollState = {
      clientHeight: 0,
      clientWidth: 0,
      contentScrollHeight: 0,
      contentScrollWidth: 0,
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
      zoomLevel: pageZoomLevel * 1,
      isRTL: undefined,
    };

    const { props } = this;

    scrollState.isRTL = this.state.isRTL;

    scrollState.scrollYBlocked = props.noScroll! || props.noScrollY!;
    scrollState.scrollXBlocked = props.noScroll! || props.noScrollX!;

    if (this.scrollerElement) {
      scrollState.clientHeight = this.scrollerElement.clientHeight;
      scrollState.clientWidth = this.scrollerElement.clientWidth;

      scrollState.scrollHeight = this.scrollerElement.scrollHeight;
      scrollState.scrollWidth = this.scrollerElement.scrollWidth;
      scrollState.scrollTop = this.scrollerElement.scrollTop;
      scrollState.scrollLeft = this.scrollerElement.scrollLeft;

      scrollState.scrollYPossible =
        !scrollState.scrollYBlocked && scrollState.scrollHeight > scrollState.clientHeight;
      scrollState.scrollXPossible =
        !scrollState.scrollXBlocked && scrollState.scrollWidth > scrollState.clientWidth;

      scrollState.trackYVisible =
        scrollState.scrollYPossible || props.permanentTracks! || props.permanentTrackY!;
      scrollState.trackXVisible =
        scrollState.scrollXPossible || props.permanentTracks! || props.permanentTrackX!;
    }

    if (this.contentElement) {
      scrollState.contentScrollHeight = this.contentElement.scrollHeight;
      scrollState.contentScrollWidth = this.contentElement.scrollWidth;
    }

    return scrollState;
  };

  /**
   * @description Scroll to top border
   */
  public scrollToTop = (): this => {
    if (this.scrollerElement) {
      this.scrollerElement.scrollTop = 0;
    }

    return this;
  };

  /**
   * @description Scroll to left border
   */
  public scrollToLeft = (): this => {
    if (this.scrollerElement) {
      this.scrollerElement.scrollLeft = 0;
    }

    return this;
  };

  /**
   * @description Scroll to bottom border
   */
  public scrollToBottom = (): this => {
    if (this.scrollerElement) {
      this.scrollerElement.scrollTop =
        this.scrollerElement.scrollHeight - this.scrollerElement.clientHeight;
    }

    return this;
  };

  /**
   * @description Scroll to right border
   */
  public scrollToRight = (): this => {
    if (this.scrollerElement) {
      this.scrollerElement.scrollLeft =
        this.scrollerElement.scrollWidth - this.scrollerElement.clientWidth;
    }

    return this;
  };

  /**
   * @description Set the scrolls at given coordinates.<br/>
   * If coordinate is undefined - current scroll value will persist.
   */
  public scrollTo = (x?: number, y?: number): this => {
    if (this.scrollerElement) {
      if (util.isNum(x)) this.scrollerElement.scrollLeft = x!;
      if (util.isNum(y)) this.scrollerElement.scrollTop = y!;
    }

    return this;
  };

  /**
   * @description Center the viewport at given coordinates.<br/>
   * If coordinate is undefined - current scroll value will persist.
   */
  public centerAt = (x?: number, y?: number): this => {
    if (this.scrollerElement) {
      if (util.isNum(x)) this.scrollerElement.scrollLeft = x - this.scrollerElement.clientWidth / 2;
      if (util.isNum(y)) this.scrollerElement.scrollTop = y - this.scrollerElement.clientHeight / 2;
    }

    return this;
  };

  public update = (force = false): ScrollState | void => {
    if (!this.scrollerElement) {
      return;
    }

    // autodetect direction if not defined
    if (util.isUndef(this.state.isRTL)) {
      this.setState({
        isRTL: getComputedStyle(this.scrollerElement).direction === 'rtl',
      });

      return this.getScrollState();
    }

    const scrollState: ScrollState = this.getScrollState(true);
    const prevScrollState: ScrollState = { ...this.scrollValues };
    const { props } = this;

    let bitmask = 0;

    if (force) {
      bitmask = 0b111_1111_1111_1111;
    } else {
      if (prevScrollState.clientHeight !== scrollState.clientHeight) bitmask |= Math.trunc(1);
      if (prevScrollState.clientWidth !== scrollState.clientWidth) bitmask |= 1 << 1;
      if (prevScrollState.scrollHeight !== scrollState.scrollHeight) bitmask |= 1 << 2;
      if (prevScrollState.scrollWidth !== scrollState.scrollWidth) bitmask |= 1 << 3;
      if (prevScrollState.scrollTop !== scrollState.scrollTop) bitmask |= 1 << 4;
      if (prevScrollState.scrollLeft !== scrollState.scrollLeft) bitmask |= 1 << 5;
      if (prevScrollState.scrollYBlocked !== scrollState.scrollYBlocked) bitmask |= 1 << 6;
      if (prevScrollState.scrollXBlocked !== scrollState.scrollXBlocked) bitmask |= 1 << 7;
      if (prevScrollState.scrollYPossible !== scrollState.scrollYPossible) bitmask |= 1 << 8;
      if (prevScrollState.scrollXPossible !== scrollState.scrollXPossible) bitmask |= 1 << 9;
      if (prevScrollState.trackYVisible !== scrollState.trackYVisible) bitmask |= 1 << 10;
      if (prevScrollState.trackXVisible !== scrollState.trackXVisible) bitmask |= 1 << 11;
      if (prevScrollState.isRTL !== scrollState.isRTL) bitmask |= 1 << 12;

      if (prevScrollState.contentScrollHeight !== scrollState.contentScrollHeight)
        bitmask |= 1 << 13;
      if (prevScrollState.contentScrollWidth !== scrollState.contentScrollWidth) bitmask |= 1 << 14;

      if (prevScrollState.zoomLevel !== scrollState.zoomLevel) bitmask |= 1 << 15;

      // if not forced and nothing has changed - skip this update
      if (bitmask === 0) {
        return prevScrollState;
      }
    }

    if (!props.native && this.holderElement) {
      if (
        bitmask & (1 << 13) &&
        (props.translateContentSizesToHolder || props.translateContentSizeYToHolder)
      ) {
        this.holderElement.style.height = `${scrollState.contentScrollHeight}px`;
      }

      if (
        bitmask & (1 << 14) &&
        (props.translateContentSizesToHolder || props.translateContentSizeXToHolder)
      ) {
        this.holderElement.style.width = `${scrollState.contentScrollWidth}px`;
      }

      if (
        props.translateContentSizesToHolder ||
        props.translateContentSizeYToHolder ||
        props.translateContentSizeXToHolder
      ) {
        if (
          (!scrollState.clientHeight && scrollState.contentScrollHeight) ||
          (!scrollState.clientWidth && scrollState.contentScrollWidth)
        ) {
          return;
        }
      }
    }

    // if scrollbars visibility has changed
    if (bitmask & (1 << 10) || bitmask & (1 << 11)) {
      prevScrollState.scrollYBlocked = scrollState.scrollYBlocked;
      prevScrollState.scrollXBlocked = scrollState.scrollXBlocked;
      prevScrollState.scrollYPossible = scrollState.scrollYPossible;
      prevScrollState.scrollXPossible = scrollState.scrollXPossible;

      if (this.trackYElement && bitmask & (1 << 10)) {
        this.trackYElement.style.display = scrollState.trackYVisible ? '' : 'none';
      }

      if (this.trackXElement && bitmask & (1 << 11)) {
        this.trackXElement.style.display = scrollState.trackXVisible ? '' : 'none';
      }

      this.scrollValues = prevScrollState;
      this.setState({
        trackYVisible: (this.scrollValues.trackYVisible = scrollState.trackYVisible)!,
        trackXVisible: (this.scrollValues.trackXVisible = scrollState.trackXVisible)!,
      });

      return;
    }

    (props.native ? this.updaterNative : this.updaterCustom)(bitmask, scrollState);

    this.scrollValues = scrollState;

    if (!props.native && bitmask & (1 << 15)) {
      util.getScrollbarWidth(true);
      this.forceUpdate();
    }

    this.eventEmitter.emit('update', { ...scrollState }, prevScrollState);

    if (bitmask & (1 << 4) || bitmask & (1 << 5))
      this.eventEmitter.emit('scroll', { ...scrollState }, prevScrollState);

    return this.scrollValues;
  };

  // eslint-disable-next-line react/sort-comp
  public render(): React.ReactNode {
    const {
      createContext,
      rtl,
      native,
      mobileNative,
      momentum,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      noDefaultStyles,

      disableTracksMousewheelScrolling,
      disableTrackXMousewheelScrolling,
      disableTrackYMousewheelScrolling,

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      disableTracksWidthCompensation,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      disableTrackXWidthCompensation,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      disableTrackYWidthCompensation,

      noScrollX,
      noScrollY,
      noScroll,

      permanentTrackX,
      permanentTrackY,
      permanentTracks,

      removeTracksWhenNotUsed,
      removeTrackYWhenNotUsed,
      removeTrackXWhenNotUsed,

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      minimalThumbSize,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      maximalThumbSize,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      minimalThumbXSize,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      maximalThumbXSize,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      minimalThumbYSize,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      maximalThumbYSize,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      fallbackScrollbarWidth,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      scrollTop,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      scrollLeft,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      trackClickBehavior,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      scrollDetectionThreshold,

      wrapperProps: propsWrapperProps,
      scrollerProps: propsScrollerProps,
      contentProps: propsContentProps,
      trackXProps: propsTrackXProps,
      trackYProps: propsTrackYProps,
      thumbXProps: propsThumbXProps,
      thumbYProps: propsThumbYProps,

      scrollbarWidth: propsScrollbarWidth,

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      elementRef,

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onUpdate,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onScroll,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onScrollStart,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onScrollStop,

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      translateContentSizesToHolder,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      translateContentSizeYToHolder,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      translateContentSizeXToHolder,

      children,

      ...propsHolderProps
    } = this.props as ScrollbarProps;

    const scrollbarWidth = util.isUndef(propsScrollbarWidth)
      ? util.getScrollbarWidth() || 0
      : propsScrollbarWidth;

    if (native || (!scrollbarWidth && mobileNative)) {
      this.elementRefHolder(null);
      this.elementRefWrapper(null);
      this.elementRefTrackX(null);
      this.elementRefTrackY(null);
      this.elementRefThumbX(null);
      this.elementRefThumbY(null);

      const contentProps = {
        ...propsContentProps,
        key: 'ScrollbarsCustom-Content',
        className: cnb('ScrollbarsCustom-Content', propsContentProps!.className),
        children,
      } as ElementPropsWithElementRefAndRenderer;

      const scrollerProps = {
        ...propsHolderProps,
        className: cnb(
          'ScrollbarsCustom native',
          this.state.trackYVisible && 'trackYVisible',
          this.state.trackXVisible && 'trackXVisible',
          this.state.isRTL && 'rtl',
          propsHolderProps.className
        ),
        style: {
          ...propsHolderProps.style,
          ...(!util.isUndef(rtl) && {
            direction: rtl ? 'rtl' : 'ltr',
          }),

          ...(momentum && { WebkitOverflowScrolling: 'touch' }),
          overflowX:
            noScroll || noScrollX
              ? 'hidden'
              : permanentTracks || permanentTrackX
              ? 'scroll'
              : 'auto',
          overflowY:
            noScroll || noScrollY
              ? 'hidden'
              : permanentTracks || permanentTrackY
              ? 'scroll'
              : 'auto',
        },
        onScroll: this.handleScrollerScroll,
        children: renderDivWithRenderer(contentProps, this.elementRefContent),
        renderer: propsScrollerProps!.renderer,
        elementRef: propsScrollerProps!.elementRef,
      } as ElementPropsWithElementRefAndRenderer;

      return renderDivWithRenderer(scrollerProps, this.elementRefScroller);
    }

    const styles = Scrollbar.calculateStyles(
      this.props,
      this.state,
      this.scrollValues,
      scrollbarWidth
    );

    const holderChildren = [] as Array<React.ReactNode>;

    const contentProps = {
      ...propsContentProps,
      key: 'ScrollbarsCustom-Content',
      className: cnb('ScrollbarsCustom-Content', propsContentProps!.className),
      style: styles.content,
      children: createContext ? (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <ScrollbarContext.Provider value={{ parentScrollbar: this }}>
          {children}
        </ScrollbarContext.Provider>
      ) : (
        children
      ),
    } as ElementPropsWithElementRefAndRenderer;

    const scrollerProps = {
      ...propsScrollerProps,
      key: 'ScrollbarsCustom-Scroller',
      className: cnb('ScrollbarsCustom-Scroller', propsScrollerProps!.className),
      style: styles.scroller,
      children: renderDivWithRenderer(contentProps, this.elementRefContent),
      onScroll: this.handleScrollerScroll,
    } as ElementPropsWithElementRefAndRenderer;

    const wrapperProps = {
      ...propsWrapperProps,
      key: 'ScrollbarsCustom-Wrapper',
      className: cnb('ScrollbarsCustom-Wrapper', propsWrapperProps!.className),
      style: styles.wrapper,
      children: renderDivWithRenderer(scrollerProps, this.elementRefScroller),
    } as ElementPropsWithElementRefAndRenderer;

    holderChildren.push(renderDivWithRenderer(wrapperProps, this.elementRefWrapper));

    if (this.state.trackYVisible || (!removeTracksWhenNotUsed && !removeTrackYWhenNotUsed)) {
      const thumbYProps = {
        ...propsThumbYProps,
        key: 'ScrollbarsCustom-ThumbY',
        style: styles.thumbY,
        elementRef: this.elementRefThumbY,
        onDrag: this.handleThumbYDrag,
        onDragEnd: this.handleThumbYDragEnd,
        axis: AXIS_DIRECTION.Y,
      } as ScrollbarThumbProps;

      const trackYProps = {
        ...propsTrackYProps,
        key: 'ScrollbarsCustom-TrackY',
        style: styles.trackY,
        elementRef: this.elementRefTrackY,
        onClick: this.handleTrackYClick,
        ...((disableTracksMousewheelScrolling || disableTrackYMousewheelScrolling) && {
          onWheel: this.handleTrackYMouseWheel,
        }),
        axis: AXIS_DIRECTION.Y,
      } as ScrollbarTrackProps;

      trackYProps.children = <ScrollbarThumb {...thumbYProps} />;
      holderChildren.push(<ScrollbarTrack {...trackYProps} />);
    } else {
      this.elementRefTrackY(null);
      this.elementRefThumbY(null);
    }

    if (this.state.trackXVisible || (!removeTracksWhenNotUsed && !removeTrackXWhenNotUsed)) {
      const thumbXProps = {
        ...propsThumbXProps,
        key: 'ScrollbarsCustom-ThumbX',
        style: styles.thumbX,
        elementRef: this.elementRefThumbX,
        onDrag: this.handleThumbXDrag,
        onDragEnd: this.handleThumbXDragEnd,
        axis: AXIS_DIRECTION.X,
      } as ScrollbarThumbProps;

      const trackXProps = {
        ...propsTrackXProps,
        key: 'ScrollbarsCustom-TrackX',
        style: styles.trackX,
        elementRef: this.elementRefTrackX,
        onClick: this.handleTrackXClick,
        ...((disableTracksMousewheelScrolling || disableTrackXMousewheelScrolling) && {
          onWheel: this.handleTrackXMouseWheel,
        }),
        axis: AXIS_DIRECTION.X,
      } as ScrollbarTrackProps;

      trackXProps.children = <ScrollbarThumb {...thumbXProps} />;
      holderChildren.push(<ScrollbarTrack {...trackXProps} />);
    } else {
      this.elementRefTrackX(null);
      this.elementRefThumbX(null);
    }

    const holderProps = {
      ...propsHolderProps,
      className: cnb(
        'ScrollbarsCustom',
        this.state.trackYVisible && 'trackYVisible',
        this.state.trackXVisible && 'trackXVisible',
        this.state.isRTL && 'rtl',
        propsHolderProps.className
      ),
      style: styles.holder,
      children: holderChildren,
    } as ElementPropsWithElementRefAndRenderer;

    return renderDivWithRenderer(holderProps, this.elementRefHolder);
  }

  // eslint-disable-next-line class-methods-use-this
  private updaterNative = (): boolean => {
    // just for future
    return true;
  };

  private updaterCustom = (bitmask: number, scrollValues: ScrollState): boolean => {
    const { props } = this;

    if (this.trackYElement) {
      if (
        this.thumbYElement &&
        (bitmask & Math.trunc(1) ||
          bitmask & (1 << 2) ||
          bitmask & (1 << 4) ||
          bitmask & (1 << 6) ||
          bitmask & (1 << 8))
      ) {
        if (scrollValues.scrollYPossible) {
          const trackInnerSize = util.getInnerHeight(this.trackYElement);
          const thumbSize = util.calcThumbSize(
            scrollValues.scrollHeight,
            scrollValues.clientHeight,
            trackInnerSize,
            props.minimalThumbYSize || props.minimalThumbSize,
            props.maximalThumbYSize || props.maximalThumbSize
          );
          const thumbOffset = util.calcThumbOffset(
            scrollValues.scrollHeight,
            scrollValues.clientHeight,
            trackInnerSize,
            thumbSize,
            scrollValues.scrollTop
          );

          this.thumbYElement.style.transform = `translateY(${thumbOffset}px)`;
          this.thumbYElement.style.height = `${thumbSize}px`;
          this.thumbYElement.style.display = '';
        } else {
          this.thumbYElement.style.transform = '';
          this.thumbYElement.style.height = '0px';
          this.thumbYElement.style.display = 'none';
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
          const trackInnerSize = util.getInnerWidth(this.trackXElement);
          const thumbSize = util.calcThumbSize(
            scrollValues.scrollWidth,
            scrollValues.clientWidth,
            trackInnerSize,
            props.minimalThumbXSize || props.minimalThumbSize,
            props.maximalThumbXSize || props.maximalThumbSize
          );
          let thumbOffset = util.calcThumbOffset(
            scrollValues.scrollWidth,
            scrollValues.clientWidth,
            trackInnerSize,
            thumbSize,
            scrollValues.scrollLeft
          );

          if (this.state.isRTL && util.shouldReverseRtlScroll()) {
            thumbOffset += trackInnerSize - thumbSize;
          }

          this.thumbXElement.style.transform = `translateX(${thumbOffset}px)`;
          this.thumbXElement.style.width = `${thumbSize}px`;
          this.thumbXElement.style.display = '';
        } else {
          this.thumbXElement.style.transform = '';
          this.thumbXElement.style.width = '0px';
          this.thumbXElement.style.display = 'none';
        }
      }
    }

    return true;
  };

  private elementRefHolder = (ref: HTMLDivElement | null) => {
    this.holderElement = ref;
    if (util.isFun(this.props.elementRef)) {
      this.props.elementRef(ref);
    }
  };

  private elementRefWrapper = (ref: HTMLDivElement | null) => {
    this.wrapperElement = ref;
    if (util.isFun(this.props.wrapperProps!.elementRef)) {
      this.props.wrapperProps!.elementRef(ref);
    }
  };

  private elementRefScroller = (ref: HTMLDivElement | null) => {
    this.scrollerElement = ref;
    if (util.isFun(this.props.scrollerProps!.elementRef)) {
      this.props.scrollerProps!.elementRef(ref);
    }
  };

  private elementRefContent = (ref: HTMLDivElement | null) => {
    this.contentElement = ref;
    if (util.isFun(this.props.contentProps!.elementRef)) {
      this.props.contentProps!.elementRef(ref);
    }
  };

  private elementRefTrackX = (ref: HTMLDivElement | null) => {
    this.trackXElement = ref;
    if (util.isFun(this.props.trackXProps!.elementRef)) {
      this.props.trackXProps!.elementRef(ref);
    }
  };

  private elementRefTrackY = (ref: HTMLDivElement | null) => {
    this.trackYElement = ref;
    if (util.isFun(this.props.trackYProps!.elementRef)) {
      this.props.trackYProps!.elementRef(ref);
    }
  };

  private elementRefThumbX = (ref: HTMLDivElement | null) => {
    this.thumbXElement = ref;
    if (util.isFun(this.props.thumbXProps!.elementRef)) {
      this.props.thumbXProps!.elementRef(ref);
    }
  };

  private elementRefThumbY = (ref: HTMLDivElement | null) => {
    this.thumbYElement = ref;
    if (util.isFun(this.props.thumbYProps!.elementRef)) {
      this.props.thumbYProps!.elementRef(ref);
    }
  };

  private handleTrackXClick = (ev: MouseEvent, values: ScrollbarTrackClickParameters): void => {
    if (this.props.trackXProps!.onClick) {
      this.props.trackXProps!.onClick(ev, values);
    }

    if (
      !this.scrollerElement ||
      !this.trackXElement ||
      !this.thumbXElement ||
      !this.scrollValues ||
      !this.scrollValues.scrollXPossible
    ) {
      return;
    }

    this._scrollDetection();

    const thumbSize = this.thumbXElement.clientWidth;
    const trackInnerSize = util.getInnerWidth(this.trackXElement);
    const thumbOffset =
      (this.scrollValues.isRTL && util.shouldReverseRtlScroll()
        ? values.offset + thumbSize / 2 - trackInnerSize
        : values.offset - thumbSize / 2) -
      (Number.parseFloat(getComputedStyle(this.trackXElement).paddingLeft) || 0);

    let target = util.calcScrollForThumbOffset(
      this.scrollValues.scrollWidth,
      this.scrollValues.clientWidth,
      trackInnerSize,
      thumbSize,
      thumbOffset
    );

    if (this.props.trackClickBehavior === TRACK_CLICK_BEHAVIOR.STEP) {
      target = (
        this.scrollValues.isRTL
          ? this.scrollValues.scrollLeft > target
          : this.scrollValues.scrollLeft < target
      )
        ? this.scrollValues.scrollLeft + this.scrollValues.clientWidth
        : this.scrollValues.scrollLeft - this.scrollValues.clientWidth;
    }

    this.scrollerElement.scrollLeft = target;
  };

  private handleTrackYClick = (ev: MouseEvent, values: ScrollbarTrackClickParameters): void => {
    if (this.props.trackYProps!.onClick) this.props.trackYProps!.onClick(ev, values);

    if (
      !this.scrollerElement ||
      !this.trackYElement ||
      !this.thumbYElement ||
      !this.scrollValues ||
      !this.scrollValues.scrollYPossible
    ) {
      return;
    }

    this._scrollDetection();

    const thumbSize = this.thumbYElement.clientHeight;
    const target =
      util.calcScrollForThumbOffset(
        this.scrollValues.scrollHeight,
        this.scrollValues.clientHeight,
        util.getInnerHeight(this.trackYElement),
        thumbSize,
        values.offset - thumbSize / 2
      ) - (Number.parseFloat(getComputedStyle(this.trackYElement).paddingTop) || 0);

    if (this.props.trackClickBehavior === TRACK_CLICK_BEHAVIOR.JUMP) {
      this.scrollerElement.scrollTop = target;
    } else {
      this.scrollerElement.scrollTop =
        this.scrollValues.scrollTop < target
          ? this.scrollValues.scrollTop + this.scrollValues.clientHeight
          : this.scrollValues.scrollTop - this.scrollValues.clientHeight;
    }
  };

  private handleTrackYMouseWheel = (ev: React.WheelEvent<HTMLDivElement>) => {
    const { props } = this;

    if (props.trackYProps && props.trackYProps.onWheel) {
      props.trackYProps.onWheel(ev);
    }

    if (props.disableTracksMousewheelScrolling || props.disableTrackYMousewheelScrolling) {
      return;
    }

    this._scrollDetection();

    if (!this.scrollerElement || this.scrollValues.scrollYBlocked) {
      return;
    }

    this.scrollTop += ev.deltaY;
  };

  private handleTrackXMouseWheel = (ev: React.WheelEvent<HTMLDivElement>) => {
    const { props } = this;

    if (props.trackXProps && props.trackXProps.onWheel) {
      props.trackXProps.onWheel(ev);
    }

    if (props.disableTracksMousewheelScrolling || props.disableTrackXMousewheelScrolling) {
      return;
    }

    this._scrollDetection();

    if (!this.scrollerElement || this.scrollValues.scrollXBlocked) {
      return;
    }

    this.scrollLeft += ev.deltaX;
  };

  private handleThumbXDrag = (data: DraggableData): void => {
    if (
      !this.trackXElement ||
      !this.thumbXElement ||
      !this.scrollerElement ||
      !this.scrollValues ||
      !this.scrollValues.scrollXPossible
    ) {
      return;
    }
    this._scrollDetection();

    const trackRect: ClientRect = this.trackXElement.getBoundingClientRect();
    const styles: CSSStyleDeclaration = getComputedStyle(this.trackXElement);
    const paddingLeft: number = Number.parseFloat(styles.paddingLeft) || 0;
    const paddingRight: number = Number.parseFloat(styles.paddingRight) || 0;
    const trackInnerSize = trackRect.width - paddingLeft - paddingRight;
    const thumbSize = this.thumbXElement.clientWidth;
    const offset =
      this.scrollValues.isRTL && util.shouldReverseRtlScroll()
        ? data.x + thumbSize - trackInnerSize + paddingLeft
        : data.lastX - paddingLeft;

    this.scrollerElement.scrollLeft = util.calcScrollForThumbOffset(
      this.scrollValues.scrollWidth,
      this.scrollValues.clientWidth,
      trackInnerSize,
      thumbSize,
      offset
    );

    if (this.props.thumbXProps?.onDrag) {
      this.props.thumbXProps.onDrag(data);
    }
  };

  private handleThumbXDragEnd = (data: DraggableData): void => {
    this.handleThumbXDrag(data);

    if (this.props.thumbXProps?.onDragEnd) {
      this.props.thumbXProps.onDragEnd(data);
    }
  };

  private handleThumbYDrag = (data: DraggableData): void => {
    if (
      !this.scrollerElement ||
      !this.trackYElement ||
      !this.thumbYElement ||
      !this.scrollValues ||
      !this.scrollValues.scrollYPossible
    ) {
      return;
    }
    this._scrollDetection();

    const trackRect: ClientRect = this.trackYElement.getBoundingClientRect();
    const styles: CSSStyleDeclaration = getComputedStyle(this.trackYElement);
    const paddingTop: number = Number.parseFloat(styles.paddingTop) || 0;
    const paddingBottom: number = Number.parseFloat(styles.paddingBottom) || 0;
    const trackInnerSize = trackRect.height - paddingTop - paddingBottom;
    const thumbSize = this.thumbYElement.clientHeight;
    const offset = data.y - paddingTop;

    this.scrollerElement.scrollTop = util.calcScrollForThumbOffset(
      this.scrollValues.scrollHeight,
      this.scrollValues.clientHeight,
      trackInnerSize,
      thumbSize,
      offset
    );

    if (this.props.thumbYProps?.onDrag) {
      this.props.thumbYProps.onDrag(data);
    }
  };

  private handleThumbYDragEnd = (data: DraggableData): void => {
    this.handleThumbYDrag(data);

    if (this.props.thumbYProps?.onDragEnd) {
      this.props.thumbYProps.onDragEnd(data);
    }
  };

  private handleScrollerScroll = () => {
    this._scrollDetection();
  };

  private _scrollDetection = () => {
    if (!this._scrollDetectionTO) {
      this.eventEmitter.emit('scrollStart', this.getScrollState());
    } else if (isBrowser) {
      window.clearTimeout(this._scrollDetectionTO);
    }

    this._scrollDetectionTO = isBrowser
      ? window.setTimeout(this._scrollDetectionCallback, this.props.scrollDetectionThreshold || 0)
      : null;
  };

  private _scrollDetectionCallback = () => {
    this._scrollDetectionTO = null;
    this.eventEmitter.emit('scrollStop', this.getScrollState());
  };
}
