import * as React from "react";
import * as ReactDom from "react-dom";
import Scrollbar from "../../src/Scrollbar";

const CustomScrollbar = ({ children, ...restProps }) => (
  <Scrollbar
    renderer={props => {
      const { elementRef, ...restProps } = props;
      return <div {...restProps} ref={elementRef} className="scrollbars-custom-holder" />;
    }}
    wrapperProps={{
      renderer: props => {
        const { elementRef, ...restProps } = props;
        return <div {...restProps} ref={elementRef} className="scrollbars-custom-wrapper" />;
      }
    }}
    scrollerProps={{
      renderer: props => {
        const { elementRef, ...restProps } = props;
        return <div {...restProps} ref={elementRef} className="scrollbars-custom-scroller" />;
      }
    }}
    {...restProps}
  >
    {children}
  </Scrollbar>
);

ReactDom.render(<CustomScrollbar>asfjkgajsdgjasdj</CustomScrollbar>, document.getElementById("AppRoot"));
