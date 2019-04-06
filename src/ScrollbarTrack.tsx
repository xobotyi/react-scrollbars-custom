import * as React from "react";
import * as PropTypes from "prop-types";
import { ElementProps } from "./Scrollbar";
import cnb from "cnbuilder";

export enum DIRECTION_AXIS {
  X = "x",
  Y = "y"
}

export interface ScrollbarTrackClickParameters {
  axis: DIRECTION_AXIS;
  offset: number;
}

export type ScrollbarTrackProps = ElementProps & {
  axis: DIRECTION_AXIS;

  className?: string;
  style?: React.CSSProperties;

  onClick?: (ev: MouseEvent, values: ScrollbarTrackClickParameters) => void;
  renderer?: React.FunctionComponent<ScrollbarTrackProps>;
};

export default class ScrollbarTrack extends React.Component<ScrollbarTrackProps, {}> {
  public element: HTMLElement | null = null;

  static propTypes = {
    axis: PropTypes.oneOf([DIRECTION_AXIS.X, DIRECTION_AXIS.Y]),

    className: PropTypes.string,

    style: PropTypes.object,

    onClick: PropTypes.func,

    elementRef: PropTypes.func,

    renderer: PropTypes.func
  } as PropTypes.InferProps<ScrollbarTrackProps>;

  public componentDidMount(): void {
    if (!this.element) {
      this.setState(() => {
        throw new Error(
          "Element was not created. Possibly you haven't provided HTMLElement to renderer's `elementRef` function."
        );
      });
      return;
    }

    this.element.addEventListener("click", this.handleClick);
  }

  public componentWillUnmount(): void {
    if (this.element) {
      this.element.removeEventListener("click", this.handleClick);
      this.element = null;
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
      "ScrollbarTrack",
      axis === DIRECTION_AXIS.X ? "ScrollbarTrack-X" : "ScrollbarTrack-Y",
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

  private handleClick = (ev: MouseEvent) => {
    if (!ev || !this.element || ev.button !== 0) {
      return;
    }

    if (typeof this.props.onClick === "function" && ev.target === this.element) {
      if (typeof ev.offsetX !== "undefined") {
        this.props.onClick(ev, {
          axis: this.props.axis,
          offset: this.props.axis === DIRECTION_AXIS.X ? ev.offsetX : ev.offsetY
        });
      } else {
        // support for old browsers
        const rect: ClientRect = this.element.getBoundingClientRect();
        this.props.onClick(ev, {
          axis: this.props.axis,
          offset: this.props.axis === DIRECTION_AXIS.X ? ev.clientX - rect.left : ev.clientY - rect.top
        });
      }
    }

    return true;
  };
}
