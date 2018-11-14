import React from "react";
import {unmountComponentAtNode} from "react-dom";

describe("NativeScrollbar", () => {
    let node;
    beforeEach(() => {
        node = document.createElement("div");
        document.body.appendChild(node);
    });
    afterEach(() => {
        unmountComponentAtNode(node);
        document.body.removeChild(node);
    });
});
