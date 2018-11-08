import PropTypes from 'prop-types';
import React     from "react";

export default class Thumb extends React.Component
{
    static displayName = "Scrollbar Track";

    static propTypes = {
        className: PropTypes.string,
        style:     PropTypes.object,

        type: PropTypes.oneOf(['x', 'y']).isRequired,

        renderer: PropTypes.func,
    };

    constructor(props) {
        super(props);

    }

    render() {
        const {className, renderer, type, ...props} = this.props;

        props.className = "thumb " + (type === 'x' ? "thumbX" : "thumb") + (className ? " " + className : "");

        return renderer
               ? renderer(props)
               : (<div { ...props } />);
    }
}
