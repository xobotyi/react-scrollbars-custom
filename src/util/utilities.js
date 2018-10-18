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

/**
 * Limit a number to fall in a specified range.
 *
 * @param {number} min The smallest allowed value
 * @param {number} value The value to clamp
 * @param {number} max The largest allowed value
 *
 * @returns {number} The clamped value.
 */
export function clamp(min, value, max) {
    return Math.max(min, Math.min(value, max));
}