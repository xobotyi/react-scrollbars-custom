import * as React from "react";
import * as PropTypes from "prop-types";
import {ElementRef} from "./Scrollbar";
import {DIRECTION_AXIS} from "./Track";

declare var global: {
    document?: Document;
};

export type DragValues = {
    axis: DIRECTION_AXIS;
    offset: number;
};

type ThumbOwnProps = {
    axis: DIRECTION_AXIS;

    className?: string;
    style?: React.CSSProperties;

    onDrag?: (values: DragValues) => void;
    onDragStart?: (values: DragValues) => void;
    onDragEnd?: (values: DragValues) => void;

    elementRef?: ElementRef;

    renderer?: React.FunctionComponent<ThumbProps>;
};

export type ThumbProps = ThumbOwnProps &
    Pick<ThumbOwnProps, Exclude<keyof ThumbOwnProps, keyof React.HTMLProps<HTMLDivElement>>>;

export default class Thumb extends React.Component<ThumbProps, {}> {
    public static displayName = "Scrollbars ThumbOld";

    public static propTypes = {
        axis: PropTypes.oneOf([DIRECTION_AXIS.X, DIRECTION_AXIS.Y]).isRequired,

        className: PropTypes.string,
        style: PropTypes.object,

        onDrag: PropTypes.func,
        onDragStart: PropTypes.func,
        onDragEnd: PropTypes.func,

        elementRef: PropTypes.func,

        renderer: PropTypes.func,
    };

    public element: HTMLElement | null;

    private dragging: boolean = false;

    private prevUserSelect: string | null;
    private prevOnSelectStart: (() => boolean) | null;

    private dragInitialOffsetX: number = 0;
    private dragInitialOffsetY: number = 0;

    public componentDidMount(): void {
        if (!this.element) {
            this.setState(() => {
                throw new Error(
                    "Somewhy element was not created. Possibly you haven't provided HTMLElement to elementRef renderer's property."
                );
            });
            return;
        }

        this.element.addEventListener("mousedown", this.handleMousedown);
        this.element.addEventListener("touchstart", this.handleTouchStart);
    }

    public componentWillUnmount(): void {
        this.handleDragEnd();
    }

    public render(): React.ReactElement<any> | null {
        const {renderer, axis, elementRef, onDrag, onDragStart, onDragEnd, ...props} = this.props;

        props.className =
            "thumb " +
            (axis === DIRECTION_AXIS.X ? "thumbX" : "thumbY") +
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

    private handleMousedown = (ev: MouseEvent) => {
        if (ev.button !== 0 || !this.element) {
            return;
        }

        ev.preventDefault();
        ev.stopImmediatePropagation();

        if (global.document) {
            global.document.addEventListener("mousemove", this.handleDrag, {passive: true});
            global.document.addEventListener("mouseup", this.handleDragEnd, {passive: true});
        }

        this.handleDragStart(ev);
    };

    private handleTouchStart = (ev: TouchEvent) => {
        if (ev.touches.length > 1 || !this.element) {
            return;
        }

        ev.preventDefault();
        ev.stopImmediatePropagation();

        if (global.document) {
            global.document.addEventListener("touchmove", this.handleDrag, {passive: true});
            global.document.addEventListener("touchend", this.handleDragEnd, {passive: true});
        }

        this.handleDragStart(ev);
    };

    private handleDragStart = (ev: MouseEvent | TouchEvent) => {
        if (!this.element) {
            this.handleDragEnd();
            return;
        }

        this.dragging = true;
        this.element.classList.add("dragging");

        if (global.document) {
            this.prevUserSelect = global.document.body.style.userSelect;
            global.document.body.style.userSelect = "none";

            // @ts-ignore
            this.prevOnSelectStart = global.document.onselectstart;
            // @ts-ignore
            global.document.onselectstart = () => false;
        }

        const thumbRect = this.element.getBoundingClientRect();
        const parentRect = this.element.offsetParent
            ? this.element.offsetParent.getBoundingClientRect()
            : {left: 0, top: 0};

        let clientX: number;
        let clientY: number;

        if (ev instanceof TouchEvent) {
            clientX = ev.targetTouches[0].pageX;
            clientY = ev.targetTouches[0].pageY;
        } else {
            clientX = ev.clientX;
            clientY = ev.clientY;
        }

        this.dragInitialOffsetX = clientX - thumbRect.left;
        this.dragInitialOffsetY = clientY - thumbRect.top;

        this.props.onDragStart &&
            this.props.onDragStart({
                axis: this.props.axis,
                offset:
                    this.props.axis === DIRECTION_AXIS.X
                        ? clientX - parentRect.left - this.dragInitialOffsetX
                        : clientY - parentRect.top - this.dragInitialOffsetY,
            });
    };

    private handleDrag = (ev: MouseEvent | TouchEvent) => {
        if (!this.dragging || !this.element) {
            this.handleDragEnd();
            return;
        }

        const parentRect = this.element.offsetParent
            ? this.element.offsetParent.getBoundingClientRect()
            : {left: 0, top: 0};

        let clientX: number;
        let clientY: number;

        if (ev instanceof TouchEvent) {
            if (ev.changedTouches.length) {
                clientX = ev.changedTouches[0].pageX;
                clientY = ev.changedTouches[0].pageY;
            } else {
                clientX = ev.targetTouches[0].pageX;
                clientY = ev.targetTouches[0].pageY;
            }
        } else {
            clientX = ev.clientX;
            clientY = ev.clientY;
        }

        this.props.onDrag &&
            this.props.onDrag({
                axis: this.props.axis,
                offset:
                    this.props.axis === DIRECTION_AXIS.X
                        ? clientX - parentRect.left - this.dragInitialOffsetX
                        : clientY - parentRect.top - this.dragInitialOffsetY,
            });
    };

    private handleDragEnd = (ev?: MouseEvent | TouchEvent) => {
        if (global.document) {
            global.document.removeEventListener("touchmove", this.handleDrag);
            global.document.removeEventListener("touchend", this.handleDragEnd);
            global.document.removeEventListener("mousemove", this.handleDrag);
            global.document.removeEventListener("mouseup", this.handleDragEnd);

            global.document.body.style.userSelect = this.prevUserSelect;
            this.prevUserSelect = null;
            // @ts-ignore
            global.document.onselectstart = this.prevOnSelectStart;
            this.prevOnSelectStart = null;
        }

        let offset = 0;

        if (this.element) {
            this.element.classList.remove("dragging");

            if (this.dragging && ev) {
                const parentRect = this.element.offsetParent
                    ? this.element.offsetParent.getBoundingClientRect()
                    : {left: 0, top: 0};

                let clientX: number;
                let clientY: number;

                if (ev instanceof TouchEvent) {
                    if (ev.changedTouches.length) {
                        clientX = ev.changedTouches[0].pageX;
                        clientY = ev.changedTouches[0].pageY;
                    } else {
                        clientX = ev.targetTouches[0].pageX;
                        clientY = ev.targetTouches[0].pageY;
                    }
                } else {
                    clientX = ev.clientX;
                    clientY = ev.clientY;
                }

                offset =
                    this.props.axis === DIRECTION_AXIS.X
                        ? clientX - parentRect.left - this.dragInitialOffsetX
                        : clientY - parentRect.top - this.dragInitialOffsetY;
            }
        }

        this.dragging = false;

        this.dragInitialOffsetX = 0;
        this.dragInitialOffsetY = 0;

        this.props.onDragEnd &&
            this.props.onDragEnd({
                axis: this.props.axis,
                offset,
            });
    };

    private ref = (ref: HTMLElement | null): void => {
        typeof this.props.elementRef === "function" && this.props.elementRef(ref);
        this.element = ref;
    };
}
