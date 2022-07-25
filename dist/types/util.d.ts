import * as React from "react";
import { ElementPropsWithElementRefAndRenderer, ElementRef } from "./types";
export declare const isUndef: (v: any) => v is any;
export declare const isFun: (v: any) => v is Function;
export declare const isNum: (v: any) => v is number;
/**
 * @description Will return renderer result if presented, div element otherwise.
 * If renderer is presented it'll receive `elementRef` function which should be used as HTMLElement's ref.
 *
 * @param props {ElementPropsWithElementRefAndRenderer}
 * @param elementRef {ElementRef}
 */
export declare const renderDivWithRenderer: (props: ElementPropsWithElementRefAndRenderer, elementRef: ElementRef) => React.ReactElement<any, any> | null;
/**
 * @description Return element's height without padding
 */
export declare const getInnerHeight: (el: HTMLElement) => number;
/**
 * @description Return element's width without padding
 */
export declare const getInnerWidth: (el: HTMLElement) => number;
/**
 * @description Return unique UUID v4
 */
export declare const uuid: () => string;
/**
 * @description Calculate thumb size for given viewport and track parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} minimalSize - Minimal thumb's size
 * @param {number} maximalSize - Maximal thumb's size
 */
export declare const calcThumbSize: (contentSize: number, viewportSize: number, trackSize: number, minimalSize?: number | undefined, maximalSize?: number | undefined) => number;
/**
 * @description Calculate thumb offset for given viewport, track and thumb parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} thumbSize - Thumb size
 * @param {number} scroll - Scroll value to represent
 */
export declare const calcThumbOffset: (contentSize: number, viewportSize: number, trackSize: number, thumbSize: number, scroll: number) => number;
/**
 * @description Calculate scroll for given viewport, track and thumb parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} thumbSize - Thumb size
 * @param {number} thumbOffset - Thumb's offset representing the scroll
 */
export declare const calcScrollForThumbOffset: (contentSize: number, viewportSize: number, trackSize: number, thumbSize: number, thumbOffset: number) => number;
/**
 * @description Set the document node to calculate the scrollbar width.<br/>
 *              <i>null</i> will force getter to return 0 (it'll imitate SSR).
 */
export declare const _dbgSetDocument: (v: Document | null) => Document | null;
/**
 * @description Return current document node
 */
export declare const _dbgGetDocument: () => Document | null;
interface GetScrollbarWidthFN {
    _cache?: number;
    (force?: boolean): number | undefined;
}
/**
 * @description Returns scrollbar width specific for current environment. Can return undefined if DOM is not ready yet.
 */
export declare const getScrollbarWidth: GetScrollbarWidthFN;
interface ShouldReverseRtlScroll {
    _cache?: boolean;
    (force?: boolean): boolean;
}
/**
 * @description Detect need of horizontal scroll reverse while RTL.
 */
export declare const shouldReverseRtlScroll: ShouldReverseRtlScroll;
export {};
