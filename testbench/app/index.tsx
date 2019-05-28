import * as React from "react";
import * as ReactDom from "react-dom";
import Scrollbar from "../../src/Scrollbar";

class App extends React.Component<{}, { count: number }> {
  public render(): React.ReactNode {
    return (
      <Scrollbar style={{ width: 500, height: 600, margin: 64 }}>
        <div style={{ width: 900, height: 1000, margin: 50 }} />
      </Scrollbar>
    );
  }
}

ReactDom.render(<App />, document.getElementById("AppRoot"));
