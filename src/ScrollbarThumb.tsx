import * as React from "react";
import * as PropTypes from "prop-types";
import cnb from "cnbuilder";
import { DraggableCore, DraggableData, DraggableEvent } from "react-draggable";
import {
  AXIS_DIRECTION,
  AXIS_DIRECTION_PROP_TYPE,
  ElementPropsWithElementRefAndRenderer,
  renderDivWithRenderer
} from "./common";
import isFun from "is-fun";
import { isUndef } from "./util";

declare var global: {
  document?: Document;
};

export type DragCallbackData = Pick<DraggableData, Exclude<keyof DraggableData, "node">>;

export type ScrollbarThumbProps = ElementPropsWithElementRefAndRenderer & {
  axis: AXIS_DIRECTION;

  onDrag?: (data: DragCallbackData) => void;
  onDragStart?: (data: DragCallbackData) => void;
  onDragEnd?: (data: DragCallbackData) => void;

  ref?: (ref: ScrollbarThumb | null) => void;
};

export default class ScrollbarThumb extends React.Component<ScrollbarThumbProps, {}> {
  static propTypes = {
    axis: AXIS_DIRECTION_PROP_TYPE,

    onDrag: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,

    elementRef: PropTypes.func,
    renderer: PropTypes.func
  };
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
  public element: HTMLDivElement | null = null;
  private prevUserSelect: string | null;
  private prevOnSelectStart: ((ev: Event) => boolean) | null;

  private static selectStartReplacer = () => false;

  public componentDidMount(): void {
    if (!this.element) {
      this.setState(() => {
        throw new Error(
          "Element was not created. Possibly you haven't provided HTMLDivElement to renderer's `elementRef` function."
        );
      });
      return;
    }
  }

  public componentWillUnmount(): void {
    this.handleOnDragStop();

    this.elementRef(null);
  }

  public handleOnDragStart = (ev: DraggableEvent, data: DraggableData) => {
    if (!this.element) {
      this.handleOnDragStop(ev, data);
      return;
    }

    if (global.document) {
      this.prevUserSelect = global.document.body.style.userSelect;
      global.document.body.style.userSelect = "none";

      this.prevOnSelectStart = global.document.onselectstart;
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

    if (!isUndef(ev.offsetX)) {
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

      axis,

      onDrag,
      onDragEnd,
      onDragStart,

      ...props
    } = this.props;

    props.className = cnb(
      "ScrollbarsCustom-Thumb",
      axis === AXIS_DIRECTION.X ? "ScrollbarsCustom-ThumbX" : "ScrollbarsCustom-ThumbY",
      props.className
    );

    if (props.renderer) {
      (props as ScrollbarThumbProps).axis = axis;
    }

    return (
      <DraggableCore
        allowAnyClick={false}
        enableUserSelectHack={false}
        onMouseDown={this.handleOnMouseDown}
        onDrag={this.handleOnDrag}
        onStart={this.handleOnDragStart}
        onStop={this.handleOnDragStop}
        children={renderDivWithRenderer(props, this.elementRef)}
      />
    );
  }

  private elementRef = (ref: HTMLDivElement | null): void => {
    isFun(this.props.elementRef) && this.props.elementRef!(ref);
    this.element = ref;
  };
}
