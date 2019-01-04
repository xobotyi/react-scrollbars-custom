let scrollbarWidth: (number | null) = null;

declare var global: {
    document?: Document
};
let doc: (Document | null) = global.document || null;

/**
 * @description Returns scrollbar width specific for current environment
 */
export default function getScrollbarWidth(force = false) {
    if (!force && scrollbarWidth !== null) {
        return scrollbarWidth;
    }

    if (!doc) {
        return (scrollbarWidth = 0);
    }

    let el = doc.createElement("div");
    el.setAttribute("style", "display:block;position:absolute;width:100px;height:100px;top:-9999px;overflow:scroll;");

    doc.body.appendChild(el);
    scrollbarWidth = el.offsetWidth - el.clientWidth || 0;
    doc.body.removeChild(el);

    return scrollbarWidth;
}

/**
 * @description Set the cached width to given value.<br/>
 *              <i>null</i> will force to recalculate value on next get.
 */
export const dbgSetScrollbarWidth = (v: number | null): void => {scrollbarWidth = v;};

/**
 * @description Set the document node to calculate the scrollbar width.<br/>
 *              <i>null</i> will force getter to return 0 (it'll imitate SSR).
 */
export const dbgSetDocument = (v: Document | null): void => {doc = v;};

/**
 * @description Return current document node
 */
export const dbgGetDocument = (): (Document | null) => doc;
