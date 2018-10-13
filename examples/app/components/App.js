import React     from "react";
import Scrollbar from 'react-scrollbars-custom';
import Body      from "./Body";
import Footer    from "./Footer";
import Head      from "./Head";

const authorName = "Anton Zinovyev";
const authorLink = "https://github.com/xobotyi";
const packageLink = "https://github.com/xobotyi/react-scrollbars-custom";
const packageName = "react-scrollbars-custom";

export default class App extends React.Component
{
    render() {
        return <Scrollbar defaultStyles={ false } contentClassName="AppContent">
            <Head packageName={ packageName } packageLink={ packageLink } />
            <Body />
            <Footer authorName={ authorName } authorLink={ authorLink } packageName={ packageName } packageLink={ packageLink } />
        </Scrollbar>;
    }
}
