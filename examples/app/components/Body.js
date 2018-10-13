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
                    <li>Native browser scrolling behaviour</li>
                    <li>Ultimate performance</li>
                    <li>Desktop or mobile - scrollbars looks the same</li>
                    <li>Fully customizable</li>
                    <li>Total tests coverage</li>
                    <li>No extra stylesheets required</li>
                    <li>Scrollbars nesting</li>
                </ul>
                <p><a href="https://github.com/xobotyi/react-scrollbars-custom/tree/master/docs">Docs on GitHub</a> | <a href="/#benchmark" target="_blank">Benchmark</a></p>
            </div>

            <h2>Examples</h2>
            <DefaultBlock />
            <CustomStyleBlock />
            <AutohideTracksBlock />
            <SandboxBlock />
        </div>;
    }
}
