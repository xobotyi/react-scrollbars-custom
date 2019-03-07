import * as React from "react";
import * as PropTypes from "prop-types";
import cnb from "cnbuilder";
import { DIRECTION_AXIS } from "./ScrollbarTrack";
import { ElementProps } from "./Scrollbar";

declare var global: {
  document?: Document;
};

export type ScrollbarThumbDragValues = {
  axis: DIRECTION_AXIS;
  clientX: number;
  clientY: number;
  offsetX: number;
  offsetY: number;
};

export type ScrollbarThumbProps = ElementProps & {
  axis: DIRECTION_AXIS;

  className?: string;
  style?: React.CSSProperties;

  onDrag?: (values: ScrollbarThumbDragValues) => void;
  onDragStart?: (values: ScrollbarThumbDragValues) => void;
  onDragEnd?: (values: ScrollbarThumbDragValues) => void;

  renderer?: React.FunctionComponent<ScrollbarThumbProps>;
};

export default class ScrollbarThumb extends React.Component<
  ScrollbarThumbProps,
  {}
> {
  public element: HTMLElement | null = null;

  private dragging: boolean = false;

  private prevUserSelect: string | null;
  private prevOnSelectStart: (() => boolean) | null;

  private offsetX: number = 0;
  private offsetY: number = 0;

  private lastClientX: number = 0;
  private lastClientY: number = 0;

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

    this.element.addEventListener("mousedown", this.handleMouseDown);
    this.element.addEventListener("touchstart", this.handleTouchStart);
  }

  public componentWillUnmount(): void {
    this.handleDragEnd();
  }

  private handleMouseDown = (ev: MouseEvent) => {
    if (ev.button !== 0 || !this.element) {
      return;
    }

    ev.preventDefault();
    ev.stopImmediatePropagation();

    if (global.document) {
      global.document.addEventListener("mousemove", this.handleMouseMove, {
        passive: true
      });
      global.document.addEventListener("mouseup", this.handleMouseDragEnd, {
        passive: true
      });
      global.document.addEventListener("mousedown", this.handleMouseDragEnd, {
        passive: true
      });
    }

    if (typeof ev.offsetX !== "undefined") {
      this.handleDragStart(ev.clientX, ev.clientY, ev.offsetX, ev.offsetY);
    } else {
      // support for old browsers
      const rect: ClientRect = this.element.getBoundingClientRect();
      this.handleDragStart(
        ev.clientX,
        ev.clientY,
        ev.clientX - rect.left,
        ev.clientY - rect.top
      );
    }
  };
  private handleMouseMove = (ev: MouseEvent) => {
    this.handleDrag(ev.clientX, ev.clientY);
  };
  private handleMouseDragEnd = (ev: MouseEvent) => {
    this.handleDragEnd(ev.clientX, ev.clientY);
  };

  private handleTouchStart = (ev: TouchEvent) => {
    if (!ev.touches.length || !this.element) {
      return;
    }

    if (global.document) {
      global.document.addEventListener("touchmove", this.handleTouchMove, {
        passive: true
      });
      global.document.addEventListener("touchend", this.handleTouchEnd, {
        passive: true
      });
    }
  };
  private handleTouchMove = (ev: TouchEvent) => {
    console.log(ev);
  };
  private handleTouchEnd = (ev: TouchEvent) => {
    console.log(ev);
  };

  private static selectStartReplacer = () => false;

  private handleDragStart = (
    clientX: number,
    clientY: number,
    offsetX: number = 0,
    offsetY: number = 0
  ) => {
    if (!this.element) {
      this.handleDragEnd(clientX, clientY);
      return;
    }

    this.dragging = true;
    this.element.classList.add("dragging");

    if (global.document) {
      this.prevUserSelect = global.document.body.style.userSelect;
      global.document.body.style.userSelect = "none";

      //@ts-ignore
      this.prevOnSelectStart = global.document.onselectstart;
      //@ts-ignore
      global.document.onselectstart = ScrollbarThumb.selectStartReplacer;
    }

    this.element.classList.add("dragging");

    this.dragging = true;
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    this.lastClientX = clientX;
    this.lastClientY = clientY;

    typeof this.props.onDragStart === "function" &&
      this.props.onDragStart({
        axis: this.props.axis,
        clientY: clientY - this.offsetY,
        clientX: clientX - this.offsetX,
        offsetY: this.offsetY,
        offsetX: this.offsetX
      });
  };

  private handleDrag = (clientX: number, clientY: number) => {
    if (!this.dragging || !this.element) {
      this.handleDragEnd(clientX, clientY);
      return;
    }

    if (typeof this.props.onDrag !== "function") {
      return;
    }

    this.lastClientX = clientX;
    this.lastClientY = clientY;

    this.props.onDrag({
      axis: this.props.axis,
      clientY: clientY - this.offsetY,
      clientX: clientX - this.offsetX,
      offsetY: this.offsetY,
      offsetX: this.offsetX
    });
  };

  private handleDragEnd = (clientX?: number, clientY?: number) => {
    if (this.dragging) {
      if (this.props.onDragEnd) {
        this.props.onDragEnd({
          axis: this.props.axis,
          clientY: (clientY || this.lastClientY) - this.offsetY,
          clientX: (clientX || this.lastClientX) - this.offsetX,
          offsetY: this.offsetY,
          offsetX: this.offsetX
        });
      }
    }

    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.lastClientX = 0;
    this.lastClientY = 0;

    if (global.document) {
      global.document.removeEventListener("mousemove", this.handleMouseMove);
      global.document.removeEventListener("mouseup", this.handleMouseDragEnd);
      global.document.removeEventListener("mousedown", this.handleMouseDragEnd);
      global.document.removeEventListener("touchmove", this.handleTouchMove);
      global.document.removeEventListener("touchend", this.handleTouchEnd);

      global.document.body.style.userSelect = this.prevUserSelect;
      this.prevUserSelect = null;
      // @ts-ignore
      global.document.onselectstart = this.prevOnSelectStart;
      this.prevOnSelectStart = null;
    }

    if (this.element) {
      this.element.classList.remove("dragging");
    }
  };

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
