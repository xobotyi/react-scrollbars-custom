import * as React from "react";
import * as PropTypes from "prop-types";
import cnb from "cnbuilder";
import { DIRECTION_AXIS } from "./ScrollbarTrack";
import { ElementProps } from "./Scrollbar";

type ScrollbarThumbProps = ElementProps & {
  axis: DIRECTION_AXIS;

  className?: string;
  style?: React.CSSProperties;

  renderer?: React.FunctionComponent<ScrollbarThumbProps>;
};

export default class ScrollbarThumb extends React.Component<
  ScrollbarThumbProps,
  {}
> {
  public element: HTMLElement | null = null;

  static propTypes = {
    axis: PropTypes.oneOf([DIRECTION_AXIS.X, DIRECTION_AXIS.Y]),

    className: PropTypes.string,

    style: PropTypes.object,

    onClick: PropTypes.func,

    elementRef: PropTypes.func,

    renderer: PropTypes.func
  };

  public componentDidMount(): void {
    if (!this.element) {
      this.setState(() => {
        throw new Error(
          "Element was not created. Possibly you haven't provided HTMLElement to renderer's `elementRef` function."
        );
      });
      return;
    }
  }

  public render(): React.ReactElement<any> | null {
    const {
      elementRef,
      renderer,

      axis,
      onClick,

      ...props
    } = this.props;

    props.className = cnb(
      "ScrollbarThumb",
      axis === DIRECTION_AXIS.X ? "ScrollbarThumb-X" : "ScrollbarThumb-Y",
      props.className
    );

    return renderer ? (
      renderer({
        ...props,
        axis,
        elementRef: this.ref
      })
    ) : (
      <div {...props} ref={this.ref} />
    );
  }

  private ref = (ref: HTMLElement | null): void => {
    typeof this.props.elementRef === "function" && this.props.elementRef(ref);
    this.element = ref;
  };
}
