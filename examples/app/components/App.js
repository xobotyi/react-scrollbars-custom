import React from "react";
import {DIRECTION_AXIS, Scrollbar, Thumb} from "react-scrollbars-custom";
import Body from "./Body";
import Footer from "./Footer";
import Head from "./Head";
import Mayhem from "./Mayhem";

const authorName = "Anton Zinovyev";
const authorLink = "https://github.com/xobotyi";
const packageLink = "https://github.com/xobotyi/react-scrollbars-custom";
const packageName = "react-scrollbars-custom";

export default class App extends React.Component {
    render() {
        return <Thumb type={DIRECTION_AXIS.X} style={{width: 200, height: 50, background: "red"}} />;

        return (
            <Scrollbar noDefaultStyles contentProps={{className: "AppContent"}}>
                <Head packageName={packageName} packageLink={packageLink} />
                {window.location.hash !== "#benchmark" && <Body packageName={packageName} packageLink={packageLink} />}
                {window.location.hash === "#benchmark" && <Mayhem />}
                <Footer
                    authorName={authorName}
                    authorLink={authorLink}
                    packageName={packageName}
                    packageLink={packageLink}
                />
            </Scrollbar>
        );
    }
}
