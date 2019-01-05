import * as React from "react";
import * as PropTypes from "prop-types";
import { DIRECTION_AXIS } from "./Scrollbar";
declare type DragValues = {
    axis: DIRECTION_AXIS;
    offset: number;
};
declare type ThumbProps = {
    [name: string]: any;
    type: DIRECTION_AXIS;
    className?: string;
    style?: React.CSSProperties;
    onDrag?: (values: DragValues) => void;
    onDragStart?: (values: DragValues) => void;
    onDragEnd?: (values: DragValues) => void;
    elementRef?: (element: HTMLElement | null) => void;
    renderer?: (args: ThumbProps) => JSX.Element;
};
export default class Thumb extends React.Component<ThumbProps, {}> {
    static displayName: string;
    static propTypes: {
        type: PropTypes.Validator<DIRECTION_AXIS>;
        className: PropTypes.Requireable<string>;
        style: PropTypes.Requireable<object>;
        onDrag: PropTypes.Requireable<(...args: any[]) => any>;
        onDragStart: PropTypes.Requireable<(...args: any[]) => any>;
        onDragEnd: PropTypes.Requireable<(...args: any[]) => any>;
        elementRef: PropTypes.Requireable<(...args: any[]) => any>;
        renderer: PropTypes.Requireable<(...args: any[]) => any>;
    };
    element: HTMLElement | null;
    private dragging;
    private prevUserSelect;
    private prevOnSelectStart;
    private dragInitialOffsetX;
    private dragInitialOffsetY;
    componentDidMount(): void;
    private handleMousedown;
    private handleTouchStart;
    private handleDragStart;
    private handleDrag;
    private handleDragEnd;
    private ref;
    render(): JSX.Element;
}
export {};
