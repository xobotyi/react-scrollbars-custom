import * as React from "react";
import * as PropTypes from "prop-types";
import {DIRECTION_AXIS} from "./Scrollbar";

type ClickValues = {
    axis: DIRECTION_AXIS;
    offset: number;
};

type TrackProps = {
    [name: string]: any;

    type: DIRECTION_AXIS;

    className?: string;
    style?: React.CSSProperties;

    onClick?: (ev: React.MouseEvent<HTMLElement>, values: ClickValues) => void;

    elementRef?: (element: HTMLElement | null) => void;

    renderer?: (args: TrackProps) => JSX.Element;
};

export default class Track extends React.Component<TrackProps, {}> {
    public static displayName = "Scrollbars Track";

    public static propTypes = {
        type: PropTypes.oneOf([DIRECTION_AXIS.X, DIRECTION_AXIS.Y]).isRequired,

        className: PropTypes.string,
        style: PropTypes.object,

        onClick: PropTypes.func,

        elementRef: PropTypes.func,

        renderer: PropTypes.func,
    };

    public element: HTMLElement | null;

    public render(): JSX.Element {
        const {className, renderer, type, elementRef, onClick, ...props}: TrackProps = this.props;

        props.className =
            "track " + (type === DIRECTION_AXIS.X ? "trackX" : "trackY") + (className ? " " + className : "");
        props.onClick = this.handleClick;

        return renderer ? (
            renderer({
                ...props,
                type,
                elementRef: this.ref,
            })
        ) : (
            <div {...props} ref={this.ref} />
        );
    }

    private handleClick = (ev: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (this.props.onClick && ev.target === this.element) {
            const rect: ClientRect = this.element.getBoundingClientRect();

            this.props.onClick(ev, {
                axis: this.props.type,
                offset: this.props.type === DIRECTION_AXIS.X ? ev.clientX - rect.left : ev.clientY - rect.top,
            });
        }

        return true;
    };

    private ref = (ref: HTMLElement | null): void => {
        typeof this.props.elementRef === "function" && this.props.elementRef(ref);
        this.element = ref;
    };
}
