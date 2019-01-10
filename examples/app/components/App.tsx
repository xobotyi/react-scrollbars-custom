import * as React from "react";
import Scrollbar from "../../../src";
import Body from "./Body";

const authorName  = "Anton Zinovyev";
const authorLink  = "https://github.com/xobotyi";
const packageLink = "https://github.com/xobotyi/react-scrollbars-custom";
const packageName = "react-scrollbars-custom";

export default class App extends React.Component {
    render() {
        return (
            <Scrollbar>
                <Body packageName={packageName} packageLink={packageLink} />
            </Scrollbar>
        );
    }
}
