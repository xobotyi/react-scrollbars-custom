"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description Return element's height without padding
 */
exports.getInnerHeight = (el) => {
    const styles = getComputedStyle(el);
    const paddingTop = styles.paddingTop ? styles.paddingTop.slice(0, -2) : 0;
    const paddingBottom = styles.paddingBottom ? styles.paddingBottom.slice(0, -2) : 0;
    return el.clientHeight - paddingTop - paddingBottom;
};
/**
 * @description Return element's width without padding
 */
exports.getInnerWidth = (el) => {
    let styles = getComputedStyle(el);
    const paddingLeft = styles.paddingLeft ? styles.paddingLeft.slice(0, -2) : 0;
    const paddingRight = styles.paddingRight ? styles.paddingRight.slice(0, -2) : 0;
    return el.clientWidth - paddingLeft - paddingRight;
};
/**
 * @description Return element's dimensions without padding
 */
exports.getInnerSizes = (el) => {
    let styles = getComputedStyle(el);
    const paddingTop = styles.paddingTop ? styles.paddingTop.slice(0, -2) : 0;
    const paddingBottom = styles.paddingBottom ? styles.paddingBottom.slice(0, -2) : 0;
    const paddingLeft = styles.paddingLeft ? styles.paddingLeft.slice(0, -2) : 0;
    const paddingRight = styles.paddingRight ? styles.paddingRight.slice(0, -2) : 0;
    return {
        width: el.clientWidth - paddingLeft - paddingRight,
        height: el.clientHeight - paddingTop - paddingBottom,
    };
};
