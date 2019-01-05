"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
var DIRECTION_AXIS;
(function (DIRECTION_AXIS) {
    DIRECTION_AXIS[DIRECTION_AXIS["X"] = 1] = "X";
    DIRECTION_AXIS[DIRECTION_AXIS["Y"] = 2] = "Y";
})(DIRECTION_AXIS = exports.DIRECTION_AXIS || (exports.DIRECTION_AXIS = {}));
class Scrollbar extends React.Component {
    constructor() {
        super(...arguments);
        this.update = () => {
        };
    }
    render() {
        return (React.createElement("div", null));
    }
}
exports.default = Scrollbar;
;
