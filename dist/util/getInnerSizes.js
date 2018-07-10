"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getInnerHeight = getInnerHeight;
exports.getInnerWidth = getInnerWidth;
exports.getInnerSizes = getInnerSizes;
/**
 * @description Returns element"s height without padding
 * @param {HTMLElement} el
 * @return {number}
 */
function getInnerHeight(el) {
    var clientHeight = el.clientHeight;

    var _getComputedStyle = getComputedStyle(el),
        paddingTop = _getComputedStyle.paddingTop,
        paddingBottom = _getComputedStyle.paddingBottom;

    return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
}

/**
 * @description Returns element"s width without padding
 * @param {HTMLElement} el
 * @return {number}
 */
function getInnerWidth(el) {
    var clientWidth = el.clientWidth;

    var _getComputedStyle2 = getComputedStyle(el),
        paddingLeft = _getComputedStyle2.paddingLeft,
        paddingRight = _getComputedStyle2.paddingRight;

    return clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
}

/**
 * @description Returns element"s dimensions without padding
 * @param {HTMLElement} el
 * @return {{width: number, height: number}}
 */
function getInnerSizes(el) {
    var clientWidth = el.clientWidth,
        clientHeight = el.clientHeight;

    var _getComputedStyle3 = getComputedStyle(el),
        paddingLeft = _getComputedStyle3.paddingLeft,
        paddingRight = _getComputedStyle3.paddingRight,
        paddingTop = _getComputedStyle3.paddingTop,
        paddingBottom = _getComputedStyle3.paddingBottom;

    return {
        width: clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight),
        height: clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom)
    };
}