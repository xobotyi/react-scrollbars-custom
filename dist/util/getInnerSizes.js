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
  var styles = getComputedStyle(el);
  return el.clientHeight - styles.paddingTop.slice(0, -2) - styles.paddingBottom.slice(0, -2);
}
/**
 * @description Returns element"s width without padding
 * @param {HTMLElement} el
 * @return {number}
 */


function getInnerWidth(el) {
  var styles = getComputedStyle(el);
  return el.clientWidth - styles.paddingLeft.slice(0, -2) - styles.paddingRight.slice(0, -2);
}
/**
 * @description Returns element"s dimensions without padding
 * @param {HTMLElement} el
 * @return {{width: number, height: number}}
 */


function getInnerSizes(el) {
  var styles = getComputedStyle(el);
  return {
    width: el.clientHeight - styles.paddingLeft.slice(0, -2) - styles.paddingRight.slice(0, -2),
    height: el.clientHeight - styles.paddingTop.slice(0, -2) - styles.paddingBottom.slice(0, -2)
  };
}