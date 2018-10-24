/**
 * @description Returns element"s height without padding
 * @param {HTMLElement} el
 * @return {number}
 */
export function getInnerHeight(el) {
    let styles = getComputedStyle(el);

    return (
        el.clientHeight -
        styles.paddingTop.slice(0, -2) -
        styles.paddingBottom.slice(0, -2)
    );
}

/**
 * @description Returns element"s width without padding
 * @param {HTMLElement} el
 * @return {number}
 */
export function getInnerWidth(el) {
    let styles = getComputedStyle(el);

    return (
        el.clientWidth -
        styles.paddingLeft.slice(0, -2) -
        styles.paddingRight.slice(0, -2)
    );
}

/**
 * @description Returns element"s dimensions without padding
 * @param {HTMLElement} el
 * @return {{width: number, height: number}}
 */
export function getInnerSizes(el) {
    let styles = getComputedStyle(el);

    return {
        width:
            el.clientHeight -
            styles.paddingLeft.slice(0, -2) -
            styles.paddingRight.slice(0, -2),
        height:
            el.clientHeight -
            styles.paddingTop.slice(0, -2) -
            styles.paddingBottom.slice(0, -2),
    };
}
