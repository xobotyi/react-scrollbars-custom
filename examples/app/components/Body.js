import React            from "react";
import CustomStyleBlock from "./blocks/CustomStyleBlock";
import DefaultBlock     from "./blocks/DefaultBlock";

export default class Head extends React.Component
{
    render() {
        return <div id="AppBody">
            <DefaultBlock />
            <CustomStyleBlock />
        </div>;
    }
}
