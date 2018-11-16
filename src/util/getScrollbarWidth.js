let scrollbarWidth = null;
let doc = typeof document !== "undefined" ? document : null;

/**
 * @description Returns scrollbar width specific for current environment
 * @return {number}
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

export function dbgSetScrollbarWidth(v) {
    return (scrollbarWidth = v);
}

export function dbgSetDocument(v) {
    return (doc = v);
}

export function dbgGetDocument() {
    return doc;
}
