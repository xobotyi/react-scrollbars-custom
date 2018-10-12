import PropTypes from "prop-types";
import React     from "react";

export default class Scrollbar extends React.Component
{
    static propTypes = {
        minimalThumbsSize: PropTypes.number,

        tagName:   PropTypes.string,
        className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    };

    static defaultProps = {
        minimalThumbsSize: 30,

        tagName: "div",
    };

    render() {
        const {
                  minimalThumbsSize,
                  tagName,
                  ...props
              } = this.props;

        console.log(props.children);

        return React.createElement(
                tagName,
                {
                    ...props,
                },
        );
    }
}
