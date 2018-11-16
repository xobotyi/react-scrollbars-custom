"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getScrollbarWidth;
exports.dbgSetScrollbarWidth = dbgSetScrollbarWidth;
exports.dbgSetDocument = dbgSetDocument;
exports.dbgGetDocument = dbgGetDocument;
var scrollbarWidth = null;
var doc = typeof document !== "undefined" ? document : null;
/**
 * @description Returns scrollbar width specific for current environment
 * @return {number}
 */

function getScrollbarWidth() {
  var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (!force && scrollbarWidth !== null) {
    return scrollbarWidth;
  }

  if (!doc) {
    return scrollbarWidth = 0;
  }

  var el = doc.createElement("div");
  el.setAttribute("style", "display:block;position:absolute;width:100px;height:100px;top:-9999px;overflow:scroll;");
  doc.body.appendChild(el);
  scrollbarWidth = el.offsetWidth - el.clientWidth || 0;
  doc.body.removeChild(el);
  return scrollbarWidth;
}

function dbgSetScrollbarWidth(v) {
  return scrollbarWidth = v;
}

function dbgSetDocument(v) {
  return doc = v;
}

function dbgGetDocument() {
  return doc;
}