let scrollbarWidth: number | null = null;

declare var global: {
    document?: Document;
};
let doc: Document | null = global.document || null;

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
    scrollbarWidth = el.offsetWidth - el.clientWidth;
    doc.body.removeChild(el);

    return scrollbarWidth;
}

/**
 * @description Set the cached width to given value.<br/>
 *              <i>null</i> will force to recalculate value on next get.
 */
export const dbgSetScrollbarWidth = (v: number | null): number | null => {
    if (v === null || typeof v === "number") {
        return (scrollbarWidth = v);
    }

    throw new TypeError("override value expected to be a number or null, got " + typeof v);
};

/**
 * @description Set the document node to calculate the scrollbar width.<br/>
 *              <i>null</i> will force getter to return 0 (it'll imitate SSR).
 */
export const dbgSetDocument = (v: Document | null): Document | null => {
    if (v === null || v instanceof HTMLDocument) {
        return (doc = v);
    }

    throw new TypeError("override value expected to be an instance of HTMLDocument or null, got " + typeof v);
};

/**
 * @description Return current document node
 */
export const dbgGetDocument = (): Document | null => doc;
