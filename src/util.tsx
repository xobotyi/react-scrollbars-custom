import * as React from "react";
import { ElementPropsWithElementRefAndRenderer, ElementRef } from "./types";

let doc: Document | null = typeof document === "object" ? document : null;

export const isUndef = (v: any): boolean => {
  return typeof v === "undefined";
};

export const isFun = (v: any): boolean => {
  return typeof v === "function";
};

export const isNum = (v: any): boolean => {
  return typeof v === "number";
};

/**
 * @description Will return renderer result if presented, div element otherwise.
 * If renderer is presented it'll receive `elementRef` function which should be used as HTMLElement's ref.
 *
 * @param props {ElementPropsWithElementRefAndRenderer}
 * @param elementRef {ElementRef}
 */
export const renderDivWithRenderer = (props: ElementPropsWithElementRefAndRenderer, elementRef: ElementRef) => {
  if (isFun(props.renderer)) {
    props.elementRef = elementRef;

    const renderer = props.renderer!;

    delete props.renderer;

    return renderer(props);
  }

  delete props.elementRef;

  return <div {...props} ref={elementRef} />;
};

const getInnerSize = (el: HTMLElement, dimension: string, padding1: string, padding2: string): number => {
  const styles = getComputedStyle(el);

  if (styles.boxSizing === "border-box") {
    return Math.max(
      0,
      (parseFloat(styles[dimension] as string) || 0) -
        (parseFloat(styles[padding1] as string) || 0) -
        (parseFloat(styles[padding2] as string) || 0)
    );
  }

  return parseFloat(styles[dimension] as string) || 0;
};

/**
 * @description Return element's height without padding
 */
export const getInnerHeight = (el: HTMLElement): number => {
  return getInnerSize(el, "height", "paddingTop", "paddingBottom");
};

/**
 * @description Return element's width without padding
 */
export const getInnerWidth = (el: HTMLElement): number => {
  return getInnerSize(el, "width", "paddingLeft", "paddingRight");
};

/**
 * @description Return unique UUID v4
 */
export const uuid = () => {
  let uuid = "";

  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 20) {
      uuid += "-" + ((Math.random() * 16) | 0).toString(16);
    } else if (i === 12) {
      uuid += "-4";
    } else if (i === 16) {
      uuid += "-" + ((Math.random() * 16) | (0 & 3) | 8).toString(16);
    } else {
      uuid += ((Math.random() * 16) | 0).toString(16);
    }
  }

  return uuid;
};

/**
 * @description Calculate thumb size for given viewport and track parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} minimalSize - Minimal thumb's size
 * @param {number} maximalSize - Maximal thumb's size
 */
export const calcThumbSize = (
  contentSize: number,
  viewportSize: number,
  trackSize: number,
  minimalSize?: number,
  maximalSize?: number
): number => {
  if (viewportSize >= contentSize) {
    return 0;
  }

  let thumbSize = (viewportSize / contentSize) * trackSize;

  isNum(maximalSize) && (thumbSize = Math.min(maximalSize!, thumbSize));
  isNum(minimalSize) && (thumbSize = Math.max(minimalSize!, thumbSize));

  return thumbSize;
};

/**
 * @description Calculate thumb offset for given viewport, track and thumb parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} thumbSize - Thumb size
 * @param {number} scroll - Scroll value to represent
 */
export const calcThumbOffset = (
  contentSize: number,
  viewportSize: number,
  trackSize: number,
  thumbSize: number,
  scroll: number
): number => {
  if (!scroll || !thumbSize || viewportSize >= contentSize) {
    return 0;
  }

  return ((trackSize - thumbSize) * scroll) / (contentSize - viewportSize);
};

/**
 * @description Calculate scroll for given viewport, track and thumb parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} thumbSize - Thumb size
 * @param {number} thumbOffset - Thumb's offset representing the scroll
 */
export const calcScrollForThumbOffset = (
  contentSize: number,
  viewportSize: number,
  trackSize: number,
  thumbSize: number,
  thumbOffset: number
): number => {
  if (!thumbOffset || !thumbSize || viewportSize >= contentSize) {
    return 0;
  }

  return (thumbOffset * (contentSize - viewportSize)) / (trackSize - thumbSize);
};

/**
 * @description Set the document node to calculate the scrollbar width.<br/>
 *              <i>null</i> will force getter to return 0 (it'll imitate SSR).
 */
export const _dbgSetDocument = (v: Document | null): Document | null => {
  if (v === null || v instanceof HTMLDocument) {
    return (doc = v);
  }

  throw new TypeError("override value expected to be an instance of HTMLDocument or null, got " + typeof v);
};

/**
 * @description Return current document node
 */
export const _dbgGetDocument = (): Document | null => doc;

interface GetScrollbarWidthFN {
  (force?: boolean): number | undefined;

  _cache?: number;
}

/**
 * @description Returns scrollbar width specific for current environment. Can return undefined if DOM is not ready yet.
 */
export const getScrollbarWidth: GetScrollbarWidthFN = (force: boolean = false): number | undefined => {
  if (!doc) {
    return (getScrollbarWidth._cache = 0);
  }

  if (!force && !isUndef(getScrollbarWidth._cache)) {
    return getScrollbarWidth._cache as number;
  }

  let el = doc.createElement("div");
  el.setAttribute("style", "position:absolute;width:100px;height:100px;top:-999px;left:-999px;overflow:scroll;");

  doc.body.appendChild(el);

  /* istanbul ignore next */
  if (el.clientWidth === 0) {
    // Do not even cache this value because there is no calculations. Issue https://github.com/xobotyi/react-scrollbars-custom/issues/123
    doc.body.removeChild(el);
    return;
  }
  getScrollbarWidth._cache = 100 - el.clientWidth;
  doc.body.removeChild(el);

  return getScrollbarWidth._cache;
};

interface ShouldReverseRtlScroll {
  (force?: boolean): boolean;

  _cache?: boolean;
}

/**
 * @description Detect need of horizontal scroll reverse while RTL.
 */
export const shouldReverseRtlScroll: ShouldReverseRtlScroll = (force: boolean = false): boolean => {
  if (!force && !isUndef(shouldReverseRtlScroll._cache)) {
    return shouldReverseRtlScroll._cache as boolean;
  }

  if (!doc) {
    return (shouldReverseRtlScroll._cache = false);
  }

  const el = doc.createElement("div");
  const child = doc.createElement("div");

  el.appendChild(child);

  el.setAttribute(
    "style",
    "position:absolute;width:100px;height:100px;top:-999px;left:-999px;overflow:scroll;direction:rtl"
  );
  child.setAttribute("style", "width:1000px;height:1000px");

  doc.body.appendChild(el);

  el.scrollLeft = -50;
  shouldReverseRtlScroll._cache = el.scrollLeft === -50;

  doc.body.removeChild(el);

  return shouldReverseRtlScroll._cache;
};
