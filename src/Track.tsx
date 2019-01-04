import React from "react";
import PropTypes from "prop-types";
import {DIRECTION_AXIS} from "./Scrollbar";

type ClickPosition = {
    axis: DIRECTION_AXIS;
    offset: number,
}

type TrackProps = {
    [name: string]: any;

    type: DIRECTION_AXIS;

    className?: string;
    style?: React.CSSProperties;

    onClick?: (ev: React.MouseEvent<HTMLElement>, position: ClickPosition) => void;

    elementRef?: (element: HTMLElement | null) => void;

    renderer?: (args: TrackProps) => JSX.Element;
};


export class Track extends React.Component<TrackProps, {}> {
    public static displayName = 'Scrollbars Track';

    public static propTypes = {
        type: PropTypes.oneOf([DIRECTION_AXIS.X, DIRECTION_AXIS.Y]).isRequired,

        className: PropTypes.string,
        style: PropTypes.object,

        onClick: PropTypes.func,

        elementRef: PropTypes.func,

        renderer: PropTypes.func,
    };

    public element: HTMLElement | null;

    private handleClick = (ev: React.MouseEvent<HTMLElement>) => {
        if (this.props.onClick && ev.target === this.element) {
            const rect: ClientRect = this.element.getBoundingClientRect();

            this.props.onClick(ev, {
                axis: this.props.type,
                offset: this.props.type === DIRECTION_AXIS.X ? ev.clientX - rect.left : ev.clientY - rect.top,
            });
        }

        return true;
    };

    public render(): JSX.Element {
        const {className, renderer, type, elementRef, onClick, ...props}: TrackProps = this.props;

        props.className = 'track ' + (type === DIRECTION_AXIS.X ? 'trackX' : 'trackY') + (className ? ' ' + className : '');
        props.onClick   = this.handleClick;

        const ref = (ref: HTMLElement | null): void => {
            typeof elementRef === "function" && elementRef(ref);
            this.element = ref;
        };

        return renderer ? (
            renderer({
                         ...props,
                         type,
                         elementRef: ref,
                     })
        ) : (
            <div {...props} ref={ref} />
        );
    }
}
