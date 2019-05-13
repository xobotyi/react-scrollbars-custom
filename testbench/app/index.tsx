import * as React from "react";
import * as ReactDom from "react-dom";
import Scrollbar from "../../src/Scrollbar";

class App extends React.Component {
  public render(): React.ReactNode {
    return (
      <Scrollbar
        style={{ minHeight: 200, width: 200, margin: 64 }}
        wrapperProps={{
          renderer: props => {
            const { elementRef, ...restProps } = props;

            return <div ref={elementRef} {...restProps} />;
          }
        }}
      />
    );
  }
}

ReactDom.render(<App />, document.getElementById("AppRoot"));
