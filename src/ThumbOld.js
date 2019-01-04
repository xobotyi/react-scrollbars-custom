import PropTypes from "prop-types";
import React from "react";
import Track from "./Track";

export const TYPE_X = 1;
export const TYPE_Y = 2;

export default class ThumbOld extends React.Component {
    static displayName = "Scrollbar ThumbOld";

    static propTypes = {
        ...Track.propTypes,

        onDrag: PropTypes.func,
        onDragStart: PropTypes.func,
        onDragEnd: PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.handleDragEnd();
    }

    handleDragStart = ev => {
        if (ev.nativeEvent.which !== 1) {
            return;
        }
        ev.nativeEvent.preventDefault();
        ev.nativeEvent.stopImmediatePropagation();

        this.isDragging = true;

        this.element.classList.add("dragging");

        const rect = this.element.getBoundingClientRect(),
            parentRect = this.element.offsetParent.getBoundingClientRect();

        // drag start offset
        this.dragStartOffsetX = ev.clientX - rect.left - rect.width / 2;
        this.dragStartOffsetY = ev.clientY - rect.top - rect.height / 2;

        if (global.document) {
            global.document.addEventListener("mousemove", this.handleDragEvent);
            global.document.addEventListener("mouseup", this.handleDragEnd);

            this.prevUserSelect = global.document.body.style.userSelect;
            global.document.body.style.userSelect = "none";
            this.prevOnSelectStart = global.document.onselectstart;
            global.document.onselectstart = () => false;
        }

        this.props.onDragStart &&
            this.props.onDragStart({
                axis: this.props.type,
                offset:
                    this.props.type === TYPE_X
                        ? ev.clientX - parentRect.left - this.dragStartOffsetX
                        : ev.clientY - parentRect.top - this.dragStartOffsetY,
            });
    };

    handleDragEvent = ev => {
        if (ev.which !== 1 || !this.props.onDrag) {
            return;
        } else if (!this.isDragging) {
            this.handleDragEnd();
            return;
        }

        const parentRect = this.element.offsetParent.getBoundingClientRect();

        this.props.onDrag({
            axis: this.props.type,
            offset:
                this.props.type === TYPE_X
                    ? ev.clientX - parentRect.left - this.dragStartOffsetX
                    : ev.clientY - parentRect.top - this.dragStartOffsetY,
        });
    };

    handleDragEnd = () => {
        this.dragStartOffsetX = false;
        this.dragStartOffsetY = false;
        this.element.classList.remove("dragging");

        if (global.document) {
            global.document.removeEventListener("mousemove", this.handleDragEvent);
            global.document.removeEventListener("mouseup", this.handleDragEnd);

            global.document.body.style.userSelect = this.prevUserSelect;
            this.prevUserSelect = null;
            global.document.onselectstart = this.prevOnSelectStart;
            this.prevOnSelectStart = null;
        }

        if (!this.isDragging) {
            return;
        }
        this.isDragging = false;

        this.props.onDragEnd && this.props.onDragEnd({axis: this.props.type});
    };

    render() {
        const {className, renderer, type, elementRef, onDrag, onDragStart, onDragEnd, ...props} = this.props;

        props.className = "thumb " + (type === TYPE_X ? "thumbX" : "thumbY") + (className ? " " + className : "");
        props.onMouseDown = this.handleDragStart;

        const ref = ref => {
            typeof elementRef === "function" && elementRef(ref);
            this.element = ref;
        };

        return renderer ? (
            renderer({
                ...props,
                elementRef: ref,
            })
        ) : (
            <div {...props} ref={ref} />
        );
    }
}
