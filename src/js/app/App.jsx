import * as React from "react";
import Scrollbar from "react-scrollbars-custom";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import AppPromo from "./AppPromo";
import ExamplesGrid from "./ExamplesGrid";

export default class App extends React.Component {
  render() {
    return (
      <Scrollbar noDefaultStyles noScrollX disableTracksWidthCompensation mobileNative>
        <div id="App">
          <AppHeader />

          <AppPromo />

          <ExamplesGrid />

          <AppFooter />
        </div>
      </Scrollbar>
    );
  }
}
