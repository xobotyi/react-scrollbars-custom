import * as React from "react";
import * as ReactDom from "react-dom";
import ScrollbarTrack, { DIRECTION_AXIS } from "../../src/ScrollbarTrack";

class App extends React.Component {
  public render(): React.ReactNode {
    return (
      <ScrollbarTrack
        axis={DIRECTION_AXIS.X}
        style={{ width: 150, height: 300, background: "red" }}
      />
    );
  }
}

ReactDom.render(<App />, document.getElementById("AppRoot"));
