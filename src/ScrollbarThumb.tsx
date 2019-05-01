import * as React from "react";
import * as PropTypes from "prop-types";
import cnb from "cnbuilder";
import { DIRECTION_AXIS } from "./ScrollbarTrack";
import { ElementProps } from "./Scrollbar";
import { DraggableCore, DraggableData, DraggableEvent } from "react-draggable";

declare var global: {
  document?: Document;
};

export type DragCallbackData = Pick<DraggableData, Exclude<keyof DraggableData, "node">>;

export type ScrollbarThumbProps = ElementProps & {
  axis: DIRECTION_AXIS;

  className?: string;
  style?: React.CSSProperties;

  onDrag?: (data: DragCallbackData) => void;
  onDragStart?: (data: DragCallbackData) => void;
  onDragEnd?: (data: DragCallbackData) => void;

  renderer?: React.FunctionComponent<ScrollbarThumbProps>;
};

export default class ScrollbarThumb extends React.Component<ScrollbarThumbProps, {}> {
  public element: HTMLElement | null = null;

  private prevUserSelect: string | null;
  private prevOnSelectStart: (() => boolean) | null;

  public initialOffsetX: number = 0;
  public initialOffsetY: number = 0;

  public lastDragData: DragCallbackData = {
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0,
    lastX: 0,
    lastY: 0
  };

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

  public componentWillUnmount(): void {
    this.handleOnDragStop();
  }

  private static selectStartReplacer = () => false;

  public handleOnDragStart = (ev: DraggableEvent, data: DraggableData) => {
    if (!this.element) {
      this.handleOnDragStop(ev, data);
      return;
    }

    if (global.document) {
      this.prevUserSelect = global.document.body.style.userSelect;
      global.document.body.style.userSelect = "none";

      //@ts-ignore
      this.prevOnSelectStart = global.document.onselectstart;
      //@ts-ignore
      global.document.onselectstart = ScrollbarThumb.selectStartReplacer;
    }

    this.props.onDragStart &&
      this.props.onDragStart(
        (this.lastDragData = {
          x: data.x - this.initialOffsetX,
          y: data.y - this.initialOffsetY,
          lastX: data.lastX - this.initialOffsetX,
          lastY: data.lastY - this.initialOffsetY,
          deltaX: data.deltaX,
          deltaY: data.deltaY
        })
      );

    this.element.classList.add("dragging");
  };

  public handleOnDrag = (ev: DraggableEvent, data: DraggableData) => {
    if (!this.element) {
      this.handleOnDragStop(ev, data);
      return;
    }

    this.props.onDrag &&
      this.props.onDrag(
        (this.lastDragData = {
          x: data.x - this.initialOffsetX,
          y: data.y - this.initialOffsetY,
          lastX: data.lastX - this.initialOffsetX,
          lastY: data.lastY - this.initialOffsetY,
          deltaX: data.deltaX,
          deltaY: data.deltaY
        })
      );
  };

  public handleOnDragStop = (ev?: DraggableEvent, data?: DraggableData) => {
    const resultData = data
      ? {
          x: data.x - this.initialOffsetX,
          y: data.y - this.initialOffsetY,
          lastX: data.lastX - this.initialOffsetX,
          lastY: data.lastY - this.initialOffsetY,
          deltaX: data.deltaX,
          deltaY: data.deltaY
        }
      : this.lastDragData;

    this.props.onDragEnd && this.props.onDragEnd(resultData);

    this.element && this.element.classList.remove("dragging");

    if (global.document) {
      global.document.body.style.userSelect = this.prevUserSelect;
      this.prevUserSelect = null;
      // @ts-ignore
      global.document.onselectstart = this.prevOnSelectStart;
      this.prevOnSelectStart = null;
    }

    this.initialOffsetX = 0;
    this.initialOffsetY = 0;
    this.lastDragData = {
      x: 0,
      y: 0,
      deltaX: 0,
      deltaY: 0,
      lastX: 0,
      lastY: 0
    };
  };

  public handleOnMouseDown = (ev: MouseEvent) => {
    if (!this.element) {
      return;
    }

    ev.stopPropagation();

    if (typeof ev.offsetX !== "undefined") {
      this.initialOffsetX = ev.offsetX;
      this.initialOffsetY = ev.offsetY;
    } else {
      const rect: ClientRect = this.element.getBoundingClientRect();
      this.initialOffsetX = ev.clientX - rect.left;
      this.initialOffsetY = ev.clientY - rect.top;
    }
  };

  public render(): React.ReactElement<any> | null {
    const {
      elementRef,
      renderer,

      axis,
      onClick,

      onDrag,
      onDragEnd,
      onDragStart,

      ...props
    } = this.props;

    props.className = cnb(
      "ScrollbarThumb",
      axis === DIRECTION_AXIS.X ? "ScrollbarThumb-X" : "ScrollbarThumb-Y",
      props.className
    );

    return (
      <DraggableCore
        allowAnyClick={false}
        enableUserSelectHack={false}
        onMouseDown={this.handleOnMouseDown}
        onDrag={this.handleOnDrag}
        onStart={this.handleOnDragStart}
        onStop={this.handleOnDragStop}
      >
        {renderer ? (
          renderer({
            ...props,
            axis,
            elementRef: this.ref
          })
        ) : (
          <div {...props} ref={this.ref} />
        )}
      </DraggableCore>
    );
  }

  private ref = (ref: HTMLElement | null): void => {
    typeof this.props.elementRef === "function" && this.props.elementRef(ref);
    this.element = ref;
  };
}
