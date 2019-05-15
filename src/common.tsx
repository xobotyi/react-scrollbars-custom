import * as React from "react";
import * as PropTypes from "prop-types";

/**
 * @description Will return renderer result if presented, div element otherwise.
 * If renderer is presented it'll receive `elementRef` function which should be used as HTMLElement's ref.
 *
 * @param props {ElementPropsWithElementRefAndRenderer}
 * @param elementRef {ElementRef}
 */
export function renderDivWithRenderer(props: ElementPropsWithElementRefAndRenderer, elementRef: ElementRef) {
  if (props.renderer) {
    props.elementRef = elementRef;

    const renderer = props.renderer;

    delete props.renderer;

    return renderer(props);
  }

  return <div {...props} ref={elementRef} />;
}

export enum AXIS_DIRECTION {
  X = "x",
  Y = "y"
}

export const AXIS_DIRECTION_PROP_TYPE = PropTypes.oneOf([AXIS_DIRECTION.X, AXIS_DIRECTION.Y]);

export enum TRACK_CLICK_BEHAVIOR {
  JUMP = "jump",
  STEP = "step"
}

export const TRACK_CLICK_BEHAVIOR_PROP_TYPE = PropTypes.oneOf([TRACK_CLICK_BEHAVIOR.JUMP, TRACK_CLICK_BEHAVIOR.STEP]);

export type ElementRef<T = HTMLDivElement> = (element: T | null) => void;

export type ElementPropsWithElementRef<T = HTMLDivElement> = React.HTMLProps<T> & {
  elementRef?: ElementRef<T>;
};

export type ElementRenderer<T = HTMLDivElement> = React.FunctionComponent<ElementPropsWithElementRef<T>>;

export type ElementPropsWithElementRefAndRenderer<T = HTMLDivElement> = React.HTMLProps<T> & {
  elementRef?: ElementRef<T>;
  renderer?: ElementRenderer<T>;
};

/**
 * @description Contains all scroll-related values
 */
export type ScrollState = {
  /**
   * @description Scroller's native clientHeight parameter
   */
  clientHeight: number;
  /**
   * @description Scroller's native clientWidth parameter
   */
  clientWidth: number;

  /**
   * @description Content's scroll height
   */
  contentScrollHeight: number;
  /**
   * @description Content's scroll width
   */
  contentScrollWidth: number;

  /**
   * @description Scroller's native scrollHeight parameter
   */
  scrollHeight: number;
  /**
   * @description Scroller's native scrollWidth parameter
   */
  scrollWidth: number;

  /**
   * @description Scroller's native scrollTop parameter
   */
  scrollTop: number;
  /**
   * @description Scroller's native scrollLeft parameter
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
