import PropTypes from 'prop-types';
import React     from "react";

export default class Thumb extends React.Component
{
    static displayName = "Scrollbar Track";

    static propTypes = {
        className: PropTypes.string,
        style:     PropTypes.object,

        type: PropTypes.oneOf(['x', 'y']).isRequired,

        elementRef: PropTypes.func,
        renderer: PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {className, renderer, type, elementRef, ...props} = this.props;

        props.className = "thumb " + (type === 'x' ? "thumbX" : "thumbY") + (className ? " " + className : "");

        return renderer
               ? renderer(props)
               : (<div { ...props } ref={ elementRef } />);
    }
}
