import * as React from "react";
import * as ReactDom from "react-dom";
import Scrollbar from "../../src/Scrollbar";
import ChangingComponent from "./ChangingComponent";

class App extends React.Component<{}, { count: number }> {
  public render(): React.ReactNode {
    return (
      <Scrollbar
        style={{ minHeight: 200, minWidth: 200, maxHeight: 600, maxWidth: 600, margin: 64 }}
        translateContentSizesToHolder
        compensateScrollbarsWidth={false}
      >
        <ChangingComponent />
      </Scrollbar>
    );
  }
}

ReactDom.render(<App />, document.getElementById("AppRoot"));
