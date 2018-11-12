import PropTypes from "prop-types";
import React from "react";

export const TYPE_X = 1;
export const TYPE_Y = 2;

export default class Track extends React.Component {
  static displayName = "Scrollbar Track";

  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,

    type: PropTypes.oneOf([TYPE_X, TYPE_Y]).isRequired,

    elementRef: PropTypes.func,
    renderer: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  onClickHandler = e => {
    if (e.target !== this.elem || !this.props.onClick) {
      return true;
    }

    const rect = this.elem.getBoundingClientRect();

    this.props.type === TYPE_X
      ? this.props.onClick(e, {
          axis: this.props.type,
          offset: e.clientX - rect.left
        })
      : this.props.onClick(e, {
          axis: this.props.type,
          offset: e.clientY - rect.top
        });
  };

  render() {
    const {
      className,
      renderer,
      type,
      elementRef,
      onClick,
      ...props
    } = this.props;

    props.className =
      "track " +
      (type === TYPE_X ? "trackX" : "trackY") +
      (className ? " " + className : "");
    props.onClick = this.onClickHandler;

    return renderer ? (
      renderer(props)
    ) : (
      <div
        {...props}
        ref={ref => {
          typeof elementRef === "function" && elementRef(ref);
          this.elem = ref;
        }}
      />
    );
  }
}
