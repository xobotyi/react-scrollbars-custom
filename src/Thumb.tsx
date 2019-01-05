import * as React from "react";
import * as PropTypes from "prop-types";
import {DIRECTION_AXIS} from "./Scrollbar";

declare var global: {
    document?: Document
};

type DragValues = {
    axis: DIRECTION_AXIS;
    offset: number,
}

type ThumbProps = {
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
    public static displayName = 'Scrollbars ThumbOld';

    public static propTypes = {
        type: PropTypes.oneOf([DIRECTION_AXIS.X, DIRECTION_AXIS.Y]).isRequired,

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
            throw new Error("Somewhy element was not created.");
        }

        this.element.addEventListener('mousedown', this.handleMousedown);
        this.element.addEventListener('touchstart', this.handleTouchStart);
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
        this.element.classList.add('dragging');

        if (global.document) {
            this.prevUserSelect                   = global.document.body.style.userSelect;
            global.document.body.style.userSelect = "none";

            // @ts-ignore
            this.prevOnSelectStart        = global.document.onselectstart;
            // @ts-ignore
            global.document.onselectstart = () => false;
        }

        const thumbRect  = this.element.getBoundingClientRect();
        const parentRect = this.element.offsetParent
            ? this.element.offsetParent.getBoundingClientRect()
            : {left: 0, top: 0};

        let clientX: number;
        let clientY: number;

        if (ev instanceof TouchEvent) {
            clientX = ev.touches[0].pageX;
            clientY = ev.touches[0].pageY;
        } else {
            clientX = ev.clientX;
            clientY = ev.clientY;
        }

        this.dragInitialOffsetX = clientX - thumbRect.left - thumbRect.width / 2;
        this.dragInitialOffsetY = clientY - thumbRect.top - thumbRect.height / 2;

        this.props.onDragStart &&
        this.props.onDragStart({
                                   axis: this.props.type,
                                   offset: this.props.type === DIRECTION_AXIS.X
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
            clientX = ev.touches[0].pageX;
            clientY = ev.touches[0].pageY;
        } else {
            clientX = ev.clientX;
            clientY = ev.clientY;
        }

        this.props.onDrag &&
        this.props.onDrag({
                              axis: this.props.type,
                              offset: this.props.type === DIRECTION_AXIS.X
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
            this.element.classList.remove('dragging');

            if (this.dragging && ev) {
                const parentRect = this.element.offsetParent
                    ? this.element.offsetParent.getBoundingClientRect()
                    : {left: 0, top: 0};

                let clientX: number;
                let clientY: number;

                if (ev instanceof TouchEvent) {
                    clientX = ev.touches[0].pageX;
                    clientY = ev.touches[0].pageY;
                } else {
                    clientX = ev.clientX;
                    clientY = ev.clientY;
                }

                offset = this.props.type === DIRECTION_AXIS.X
                    ? clientX - parentRect.left - this.dragInitialOffsetX
                    : clientY - parentRect.top - this.dragInitialOffsetY;
            }
        }

        this.dragging = false;

        this.dragInitialOffsetX = 0;
        this.dragInitialOffsetY = 0;

        this.props.onDragEnd &&
        this.props.onDragEnd({
                                 axis: this.props.type,
                                 offset,
                             });
    };

    private ref = (ref: HTMLElement | null): void => {
        typeof this.props.elementRef === "function" && this.props.elementRef(ref);
        this.element = ref;
    };

    public render(): JSX.Element {
        const {className, renderer, type, elementRef, onDrag, onDragStart, onDragEnd, ...props}: ThumbProps = this.props;

        props.className = 'track ' + (type === DIRECTION_AXIS.X ? 'trackX' : 'trackY') + (className ? ' ' + className : '');

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
}
