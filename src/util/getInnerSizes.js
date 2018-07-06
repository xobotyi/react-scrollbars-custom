/**
 * Returns element's height without paddings
 *
 * @param {HTMLElement} el
 * @return {number}
 */
export function getInnerHeight(el) {
    const {clientHeight} = el;
    const {paddingTop, paddingBottom} = getComputedStyle(el);

    return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
}

/**
 * Returns element's width without paddings
 *
 * @param {HTMLElement} el
 * @return {number}
 */
export function getInnerWigth(el) {
    const {clientWidth} = el;
    const {paddingLeft, paddingRight} = getComputedStyle(el);

    return clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
}

/**
 * Returns element's dimensions without paddings
 *
 * @param {HTMLElement} el
 * @return {{width: number, height: number}}
 */
export function getInnerSizes(el) {
    const {clientWidth, clientHeight} = el;
    const {paddingLeft, paddingRight, paddingTop, paddingBottom} = getComputedStyle(el);

    return {
        width:  clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight),
        height: clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom),
    };
}
