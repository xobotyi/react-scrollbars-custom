"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.wrapper = wrapper;
exports.content = content;
exports.trackVertical = trackVertical;
exports.trackHorizontal = trackHorizontal;
exports.thumbVertical = thumbVertical;
exports.thumbHorizontal = thumbHorizontal;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wrapper(props) {
    return _react2.default.createElement("div", _extends({ className: "CustomScrollbar-wrapper" }, props));
}

function content(props) {
    return _react2.default.createElement("div", _extends({ className: "CustomScrollbar-content" }, props));
}

function trackVertical(props) {
    return _react2.default.createElement("div", _extends({ className: "CustomScrollbar-track CustomScrollbar-trackVertical" }, props));
}

function trackHorizontal(props) {
    return _react2.default.createElement("div", _extends({ className: "CustomScrollbar-track CustomScrollbar-trackHorizontal" }, props));
}

function thumbVertical(props) {
    return _react2.default.createElement("div", _extends({ className: "CustomScrollbar-thumb CustomScrollbar-thumbVertical" }, props));
}

function thumbHorizontal(props) {
    return _react2.default.createElement("div", _extends({ className: "CustomScrollbar-thumb CustomScrollbar-thumbHorizontal" }, props));
}