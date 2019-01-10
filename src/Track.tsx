import * as React from "react";
import * as PropTypes from "prop-types";
import {ElementRef} from "./Scrollbar";

export enum DIRECTION_AXIS {
    X = "x",
    Y = "y",
}

export type TrackClickValues = {
    axis: DIRECTION_AXIS;
    offset: number;
};

type TrackOwnProps = {
    axis: DIRECTION_AXIS;

    className?: string;
    style?: React.CSSProperties;

    onClick?: (ev: MouseEvent, values: TrackClickValues) => void;

    elementRef?: ElementRef;

    renderer?: React.FunctionComponent<TrackProps>;
};

export type TrackProps = TrackOwnProps &
    Pick<TrackOwnProps, Exclude<keyof TrackOwnProps, keyof React.HTMLProps<HTMLDivElement>>>;

export default class Track extends React.Component<TrackProps, {}> {
    public static displayName = "Scrollbars Track";

    public static propTypes = {
        axis: PropTypes.oneOf([DIRECTION_AXIS.X, DIRECTION_AXIS.Y]).isRequired,

        className: PropTypes.string,
        style: PropTypes.object,

        onClick: PropTypes.func,

        elementRef: PropTypes.func,

        renderer: PropTypes.func,
    };

    public element: HTMLElement | null;

    public componentDidMount(): void {
        if (!this.element) {
            this.setState(() => {
                throw new Error(
                    "Somewhy element was not created. Possibly you haven't provided HTMLElement to elementRef renderer's property."
                );
            });
            return;
        }

        this.element.addEventListener("click", this.handleClick);
    }

    public render(): React.ReactElement<any> | null {
        const {renderer, axis, elementRef, onClick, ...props} = this.props;

        props.className =
            "track " +
            (axis === DIRECTION_AXIS.X ? "trackX" : "trackY") +
            (props.className ? " " + props.className : "");

        return renderer ? (
            renderer({
                ...props,
                axis,
                elementRef: this.ref,
            })
        ) : (
            <div {...props} ref={this.ref} />
        );
    }

    private handleClick = (ev: MouseEvent) => {
        if (ev.button !== 0 || !this.element) {
            return;
        }

        if (this.props.onClick && ev.target === this.element) {
            const rect: ClientRect = this.element.getBoundingClientRect();

            this.props.onClick(ev, {
                axis: this.props.axis,
                offset: this.props.axis === DIRECTION_AXIS.X ? ev.clientX - rect.left : ev.clientY - rect.top,
            });
        }

        return true;
    };

    private ref = (ref: HTMLElement | null): void => {
        typeof this.props.elementRef === "function" && this.props.elementRef(ref);
        this.element = ref;
    };
}
