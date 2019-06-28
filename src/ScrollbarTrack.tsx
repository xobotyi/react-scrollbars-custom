import * as React from "react";
import * as PropTypes from "prop-types";
import cnb from "cnbuilder";
import {
  AXIS_DIRECTION,
  AXIS_DIRECTION_PROP_TYPE,
  ElementPropsWithElementRefAndRenderer,
  renderDivWithRenderer
} from "./common";
import isFun from "is-fun";
import { isUndef } from "./util";

export interface ScrollbarTrackClickParameters {
  axis: AXIS_DIRECTION;
  offset: number;
}

export type ScrollbarTrackProps = ElementPropsWithElementRefAndRenderer & {
  axis: AXIS_DIRECTION;

  onClick?: (ev: MouseEvent, values: ScrollbarTrackClickParameters) => void;

  ref?: (ref: ScrollbarTrack | null) => void;
};

export default class ScrollbarTrack extends React.Component<ScrollbarTrackProps, {}> {
  static propTypes = {
    axis: AXIS_DIRECTION_PROP_TYPE,

    onClick: PropTypes.func,

    elementRef: PropTypes.func,
    renderer: PropTypes.func
  };
  public element: HTMLDivElement | null = null;

  public componentDidMount(): void {
    if (!this.element) {
      this.setState(() => {
        throw new Error(
          "Element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function."
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

      this.elementRef(null);
    }
  }

  public render(): React.ReactElement<any> | null {
    const {
      elementRef,

      axis,
      onClick,

      ...props
    } = this.props;

    props.className = cnb(
      "ScrollbarsCustom-Track",
      axis === AXIS_DIRECTION.X ? "ScrollbarsCustom-TrackX" : "ScrollbarsCustom-TrackY",
      props.className
    );

    if (props.renderer) {
      (props as ScrollbarTrackProps).axis = axis;
    }

    return renderDivWithRenderer(props, this.elementRef);
  }

  private elementRef = (ref: HTMLDivElement | null): void => {
    isFun(this.props.elementRef) && this.props.elementRef!(ref);
    this.element = ref;
  };

  private handleClick = (ev: MouseEvent) => {
    if (!ev || !this.element || ev.button !== 0) {
      return;
    }

    if (isFun(this.props.onClick) && ev.target === this.element) {
      if (!isUndef(ev.offsetX)) {
        this.props.onClick!(ev, {
          axis: this.props.axis,
          offset: this.props.axis === AXIS_DIRECTION.X ? ev.offsetX : ev.offsetY
        });
      } else {
        // support for old browsers
        const rect: ClientRect = this.element.getBoundingClientRect();
        this.props.onClick!(ev, {
          axis: this.props.axis,
          offset: this.props.axis === AXIS_DIRECTION.X ? ev.clientX - rect.left : ev.clientY - rect.top
        });
      }
    }

    return true;
  };
}
