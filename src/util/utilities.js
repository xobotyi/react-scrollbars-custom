/**
 * @description Check if variable defined and not null
 * @param v
 * @return {boolean}
 */
export function isset(v) {
    return typeof v !== "undefined" && v !== null;
}

let scrollbarWidth = null;

/**
 * @description Returns scrollbar width specific for current environment
 * @return {number}
 */
export function getScrollbarWidth() {
    if (!isset(document)) { return 0; }

    if (scrollbarWidth !== null) { return scrollbarWidth; }

    let el = document.createElement("div");
    el.setAttribute("style", "display:block;position:absolute;width:100px;height:100px;top:-9999px;overflow:scroll;");

    document.body.appendChild(el);
    scrollbarWidth = (el.offsetWidth - el.clientWidth) || 0;
    document.body.removeChild(el);

    return scrollbarWidth;
}
