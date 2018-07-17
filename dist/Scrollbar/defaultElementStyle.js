"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var holder = exports.holder = {
    display: "grid",
    position: "relative",
    gridTemplateColumns: "1fr min-content",
    gridTemplateRows: "1fr min-content"
};
var wrapper = exports.wrapper = {
    gridColumn: 1,
    gridRow: 1
};
var trackVertical = exports.trackVertical = {
    position: "relative",
    width: 8,
    background: "rgba(0,0,0,.1)",
    gridColumn: 2,
    gridRow: 1
};
var trackHorizontal = exports.trackHorizontal = {
    position: "relative",
    height: 8,
    background: "rgba(0,0,0,.1)",
    gridColumn: 1,
    gridRow: 2
};
var thumbVertical = exports.thumbVertical = {
    position: "relative",
    width: "100%",
    height: 0,
    cursor: "pointer",
    background: "rgba(0,0,0,.35)"
};
var thumbHorizontal = exports.thumbHorizontal = {
    position: "relative",
    height: "100%",
    width: 0,
    cursor: "pointer",
    background: "rgba(0,0,0,.35)"
};
var content = exports.content = {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "scroll"
};

var holderGridless = exports.holderGridless = {
    position: "relative"
};
var wrapperGridless = exports.wrapperGridless = {
    minHeight: "100%"
};
var trackVerticalGridless = exports.trackVerticalGridless = {
    background: "rgba(0,0,0,.1)",
    position: "absolute",
    width: 8,
    height: "100%",
    right: 0,
    top: 0
};
var trackHorizontalGridless = exports.trackHorizontalGridless = {
    background: "rgba(0,0,0,.1)",
    position: "absolute",
    height: 8,
    width: "100%",
    left: 0,
    bottom: 0
};