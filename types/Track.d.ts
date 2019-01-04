import * as React from "react";
import * as PropTypes from "prop-types";
import { DIRECTION_AXIS } from "./Scrollbar";
declare type ClickValues = {
    axis: DIRECTION_AXIS;
    offset: number;
};
declare type TrackProps = {
    [name: string]: any;
    type: DIRECTION_AXIS;
    className?: string;
    style?: React.CSSProperties;
    onClick?: (ev: React.MouseEvent<HTMLElement>, values: ClickValues) => void;
    elementRef?: (element: HTMLElement | null) => void;
    renderer?: (args: TrackProps) => JSX.Element;
};
export default class Track extends React.Component<TrackProps, {}> {
    static displayName: string;
    static propTypes: {
        type: PropTypes.Validator<DIRECTION_AXIS>;
        className: PropTypes.Requireable<string>;
        style: PropTypes.Requireable<object>;
        onClick: PropTypes.Requireable<(...args: any[]) => any>;
        elementRef: PropTypes.Requireable<(...args: any[]) => any>;
        renderer: PropTypes.Requireable<(...args: any[]) => any>;
    };
    element: HTMLElement | null;
    private handleClick;
    private ref;
    render(): JSX.Element;
}
export {};
