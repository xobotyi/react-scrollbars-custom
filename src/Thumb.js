import PropTypes from "prop-types";
import React from "react";

export const TYPE_X = 1;
export const TYPE_Y = 2;

export default class Thumb extends React.Component {
  static displayName = "Scrollbar Track";

  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,

    type: PropTypes.oneOf([TYPE_X, TYPE_Y]).isRequired,

    elementRef: PropTypes.func,
    renderer: PropTypes.func,

    onDrag: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  handleDragStart = e => {
    if (e.nativeEvent.which !== 1) {
      return;
    }
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopImmediatePropagation();

    this.isDragging = true;

    this.elem.classList.add("dragging");

    const rect = this.elem.getBoundingClientRect(),
      parentRect = this.elem.offsetParent.getBoundingClientRect();

    // drag start offset
    this.dragStartOffsetX = e.clientX - rect.left - rect.width / 2;
    this.dragStartOffsetY = e.clientY - rect.top - rect.height / 2;

    document.addEventListener("mousemove", this.handleDragEvent);
    document.addEventListener("mouseup", this.handleDragEnd);

    this.previoususerSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    this.previousOnSelectStart = document.onselectstart;
    document.onselectstart = () => false;

    this.props.onDragStart &&
      (this.props.type === TYPE_X
        ? this.props.onDragStart({
            axis: this.props.type,
            offset: e.clientX - parentRect.left - this.dragStartOffsetX
          })
        : this.props.onDragStart({
            axis: this.props.type,
            offset: e.clientY - parentRect.top - this.dragStartOffsetY
          }));
  };

  handleDragEvent = e => {
    if (e.which !== 1 || !this.props.onDrag) {
      return;
    } else if (!this.isDragging) {
      this.handleDragEnd();
    }

    const parentRect = this.elem.offsetParent.getBoundingClientRect();

    this.props.type === TYPE_X
      ? this.props.onDrag({
          axis: this.props.type,
          offset: e.clientX - parentRect.left - this.dragStartOffsetX
        })
      : this.props.onDrag({
          axis: this.props.type,
          offset: e.clientY - parentRect.top - this.dragStartOffsetY
        });
  };

  handleDragEnd = () => {
    this.isDragging = false;
    this.dragStartOffsetX = false;
    this.dragStartOffsetY = false;
    this.elem.classList.remove("dragging");

    document.removeEventListener("mousemove", this.handleDragEvent);
    document.removeEventListener("mouseup", this.handleDragEnd);

    document.body.style.userSelect = this.previoususerSelect;
    this.previoususerSelect = null;
    document.onselectstart = this.previousOnSelectStart;
    this.previousOnSelectStart = null;

    this.props.onDragEnd && this.props.onDragEnd({ axis: this.props.type });
  };

  render() {
    const {
      className,
      renderer,
      type,
      elementRef,
      onDrag,
      onDragStart,
      onDragEnd,
      ...props
    } = this.props;

    props.className =
      "thumb " +
      (type === "x" ? "thumbX" : "thumbY") +
      (className ? " " + className : "");

    return renderer ? (
      renderer(props)
    ) : (
      <div
        {...props}
        onMouseDown={this.handleDragStart}
        ref={ref => {
          typeof elementRef === "function" && elementRef(ref);
          this.elem = ref;
        }}
      />
    );
  }
}
