/**
 * @description Return element's height without padding
 */
export declare const getInnerHeight: (el: HTMLElement) => number;
/**
 * @description Return element's width without padding
 */
export declare const getInnerWidth: (el: HTMLElement) => number;
interface elementInnerSizes {
    width: number;
    height: number;
}
/**
 * @description Return element's dimensions without padding
 */
export declare const getInnerSizes: (el: HTMLElement) => elementInnerSizes;
export {};
