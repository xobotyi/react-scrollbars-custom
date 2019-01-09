import * as React from "react";
import * as PropTypes from "prop-types";
import {DIRECTION_AXIS} from "./Scrollbar";

type ClickValues = {
    axis: DIRECTION_AXIS;
    offset: number;
};

export type TrackProps = React.HTMLProps<HTMLDivElement> & {
    axis: DIRECTION_AXIS;

    className?: string;
    tagName?: string;
    style?: React.CSSProperties;

    onClick?: (ev: MouseEvent, values: ClickValues) => void;

    elementRef?: (element: HTMLElement | null) => void;

    renderer?: React.FunctionComponent<TrackProps>;
};

export default class Track extends React.Component<TrackProps, {}> {
    public static displayName = "Scrollbars Track";

    public static propTypes = {
        axis: PropTypes.oneOf([DIRECTION_AXIS.X, DIRECTION_AXIS.Y]).isRequired,

        tagName: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,

        onClick: PropTypes.func,

        elementRef: PropTypes.func,

        renderer: PropTypes.func,
    };

    public static defaultProps = {
        tagName: "div",
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
        const {renderer, axis, elementRef, onClick, tagName, ...props}: TrackProps = this.props;

        props.className =
            "track " +
            (axis === DIRECTION_AXIS.X ? "trackX" : "trackY") +
            (props.className ? " " + props.className : "");

        const TagName: any = tagName;

        return renderer ? (
            renderer({
                ...props,
                axis,
                tagName,
                elementRef: this.ref,
            })
        ) : (
            <TagName {...props} ref={this.ref} />
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
