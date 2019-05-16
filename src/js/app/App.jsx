import * as React from "react";
import Scrollbar from "react-scrollbars-custom";
import AppHeader from "./AppHeader";
import AppPromo from "./AppPromo";

export default class App extends React.Component
{
    render()
    {
        return (
            <Scrollbar noDefaultStyles>
                <div id="App">
                    <AppHeader />

                    <AppPromo />
                </div>
            </Scrollbar>
        );
    }
}