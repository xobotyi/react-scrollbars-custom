import "core-js/stable";

import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app/App";

const appHolder = document.getElementById("AppRoot");

ReactDOM.render(
    <App />,
    appHolder,
);