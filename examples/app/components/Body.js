import React               from "react";
import AutohideTracksBlock from "./blocks/AutohideTracksBlock";
import CustomStyleBlock    from "./blocks/CustomStyleBlock";
import DefaultBlock        from "./blocks/DefaultBlock";
import SandboxBlock        from "./blocks/SandboxBlock";

export default class Head extends React.Component
{
    render() {
        return <div id="AppBody">
            <div className="packageDescription">
                <p>{ this.props.packageName } is crossbrowser React component that allow you to easy customize scrollbars.
                                              No matter what platform you targeted, with { this.props.packageName } scrollbars will look the same.
                </p>
                <h2>Features</h2>
                <ul className="features">
                    <li>Native browser scrolling behaviour - component don't emulate scrolling, only showing custom scrollbars</li>
                    <li>Ultimate performance - 60 fps with help of RAF loop</li>
                    <li>Desktop or mobile - scrollbars looks the same on any device</li>
                    <li>No extra stylesheets required - minimum inline styles out of the box</li>
                    <li>Fully customizable - want a hippo as a scrollbar thumb? Well.. I don't judge you</li>
                    <li>No matter what changes the content - scrollbars always stay actual</li>
                    <li>Total tests coverage</li>
                    <li>Scrollbars nesting</li>
                    <li>RTL support</li>
                    <li>momentum scrolling for iOS</li>
                </ul>
                <p><a href="https://github.com/xobotyi/react-scrollbars-custom/tree/master/docs">Docs on GitHub</a> | <a href="./#benchmark" target="_blank">Benchmark</a></p>
            </div>

            <h2>Examples</h2>
            <DefaultBlock />
            <CustomStyleBlock />
            <AutohideTracksBlock />
            <SandboxBlock />
        </div>;
    }
}
