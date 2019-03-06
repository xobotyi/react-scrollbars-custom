import * as React from "react";
import * as ReactDom from "react-dom";
import Scrollbar from "../../src/Scrollbar";

class App extends React.Component {
  public render(): React.ReactNode {
    return (
      <Scrollbar
        style={{ width: 200, height: 200 }}
        scrollTop={450}
        scrollLeft={400}
      >
        <div style={{ width: 1000, height: 1000 }} />
      </Scrollbar>
    );
  }
}

ReactDom.render(<App />, document.getElementById("AppRoot"));
