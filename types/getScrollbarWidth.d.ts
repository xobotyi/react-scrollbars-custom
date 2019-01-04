/**
 * @description Returns scrollbar width specific for current environment
 */
export default function getScrollbarWidth(force?: boolean): number;
/**
 * @description Set the cached width to given value.<br/>
 *              <i>null</i> will force to recalculate value on next get.
 */
export declare const dbgSetScrollbarWidth: (v: number | null) => void;
/**
 * @description Set the document node to calculate the scrollbar width.<br/>
 *              <i>null</i> will force getter to return 0 (it'll imitate SSR).
 */
export declare const dbgSetDocument: (v: Document | null) => void;
/**
 * @description Return current document node
 */
export declare const dbgGetDocument: () => Document | null;
