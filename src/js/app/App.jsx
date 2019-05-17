import * as React from "react";
import Scrollbar from "react-scrollbars-custom";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import AppPromo from "./AppPromo";
import CardsGrid from "./CardsGrid";

export default class App extends React.Component {
  render() {
    return (
      <Scrollbar noDefaultStyles>
        <div id="App">
          <AppHeader />

          <AppPromo />

          <CardsGrid />

          <AppFooter />
        </div>
      </Scrollbar>
    );
  }
}
