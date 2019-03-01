import * as React from "react";
import * as PropTypes from "prop-types";
import Loop from "./Loop";

export default class Scrollbar extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  public componentDidMount(): void {
    Loop.addTarget(this);
  }

  public componentWillUnmount(): void {
    Loop.removeTarget(this);
  }

  public update() {}
}
