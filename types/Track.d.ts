import * as React from "react";
import * as PropTypes from "prop-types";
import { DIRECTION_AXIS } from "./Scrollbar";
declare type ClickValues = {
    axis: DIRECTION_AXIS;
    offset: number;
};
declare type TrackProps = {
    [name: string]: any;
    axis: DIRECTION_AXIS;
    className?: string;
    tagName?: string;
    style?: React.CSSProperties;
    onClick?: (ev: MouseEvent, values: ClickValues) => void;
    elementRef?: (element: HTMLElement | null) => void;
    renderer?: (args: TrackProps) => JSX.Element;
};
export default class Track extends React.Component<TrackProps, {}> {
    static displayName: string;
    static propTypes: {
        axis: PropTypes.Validator<DIRECTION_AXIS>;
        tagName: PropTypes.Requireable<string>;
        className: PropTypes.Requireable<string>;
        style: PropTypes.Requireable<object>;
        onClick: PropTypes.Requireable<(...args: any[]) => any>;
        elementRef: PropTypes.Requireable<(...args: any[]) => any>;
        renderer: PropTypes.Requireable<(...args: any[]) => any>;
    };
    static defaultProps: {
        tagName: string;
    };
    element: HTMLElement | null;
    componentDidMount(): void;
    render(): JSX.Element;
    private handleClick;
    private ref;
}
export {};
