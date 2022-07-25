import * as React from "react";
import { DraggableData, DraggableEvent } from "react-draggable";
import { AXIS_DIRECTION, ElementPropsWithElementRefAndRenderer } from "./types";
export declare type DragCallbackData = Pick<DraggableData, Exclude<keyof DraggableData, "node">>;
export declare type ScrollbarThumbProps = ElementPropsWithElementRefAndRenderer & {
    axis: AXIS_DIRECTION;
    onDrag?: (data: DragCallbackData) => void;
    onDragStart?: (data: DragCallbackData) => void;
    onDragEnd?: (data: DragCallbackData) => void;
    ref?: (ref: ScrollbarThumb | null) => void;
};
export default class ScrollbarThumb extends React.Component<ScrollbarThumbProps, {}> {
    initialOffsetX: number;
    initialOffsetY: number;
    lastDragData: DragCallbackData;
    element: HTMLDivElement | null;
    private prevUserSelect;
    private prevOnSelectStart;
    private elementRefHack;
    private static selectStartReplacer;
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleOnDragStart: (ev: DraggableEvent, data: DraggableData) => void;
    handleOnDrag: (ev: DraggableEvent, data: DraggableData) => void;
    handleOnDragStop: (ev?: React.MouseEvent<HTMLElement | SVGElement, MouseEvent> | React.TouchEvent<HTMLElement | SVGElement> | MouseEvent | TouchEvent | undefined, data?: DraggableData | undefined) => void;
    handleOnMouseDown: (ev: MouseEvent) => void;
    render(): React.ReactElement<any> | null;
    private elementRef;
}
