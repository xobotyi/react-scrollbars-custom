import PropTypes from "prop-types";
import React from "react";
import Track from "./Track";

export const TYPE_X = 1;
export const TYPE_Y = 2;

export default class Thumb extends React.Component {
    static displayName = "Scrollbar Thumb";

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

        document.addEventListener("mousemove", this.handleDragEvent);
        document.addEventListener("mouseup", this.handleDragEnd);

        this.prevUserSelect = document.body.style.userSelect;
        document.body.style.userSelect = "none";
        this.prevOnSelectStart = document.onselectstart;
        document.onselectstart = () => false;

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
        this.isDragging = false;
        this.dragStartOffsetX = false;
        this.dragStartOffsetY = false;
        this.element.classList.remove("dragging");

        document.removeEventListener("mousemove", this.handleDragEvent);
        document.removeEventListener("mouseup", this.handleDragEnd);

        document.body.style.userSelect = this.prevUserSelect;
        this.prevUserSelect = null;
        document.onselectstart = this.prevOnSelectStart;
        this.prevOnSelectStart = null;

        this.props.onDragEnd && this.props.onDragEnd({axis: this.props.type});
    };

    render() {
        const {className, renderer, type, elementRef, onDrag, onDragStart, onDragEnd, ...props} = this.props;

        props.className = "thumb " + (type === TYPE_X ? "thumbX" : "thumbY") + (className ? " " + className : "");
        props.onMouseDown = this.handleDragStart;

        return renderer ? (
            renderer(props)
        ) : (
            <div
                {...props}
                ref={ref => {
                    typeof elementRef === "function" && elementRef(ref);
                    this.element = ref;
                }}
            />
        );
    }
}
