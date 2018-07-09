/**
 * @description Returns element"s height without padding
 * @param {HTMLElement} el
 * @return {number}
 */
export function getInnerHeight(el) {
    const {clientHeight} = el;
    const {paddingTop, paddingBottom} = getComputedStyle(el);

    return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
}

/**
 * @description Returns element"s width without padding
 * @param {HTMLElement} el
 * @return {number}
 */
export function getInnerWidth(el) {
    const {clientWidth} = el;
    const {paddingLeft, paddingRight} = getComputedStyle(el);

    return clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
}

/**
 * @description Returns element"s dimensions without padding
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
