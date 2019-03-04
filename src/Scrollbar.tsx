import * as React from "react";
import * as PropTypes from "prop-types";
import Loop from "./Loop";

export type ElementRef<T = HTMLElement> = (element: T | null) => void;

export type ElementProps = React.HTMLProps<HTMLElement> & {
  elementRef?: ElementRef;
  renderer?: React.FunctionComponent<ElementProps>;
};

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
