import PropTypes from "prop-types";
import React     from "react";

export default class Track extends React.Component
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

    handleClick = () => {

    };

    render() {
        const {className, renderer, type, ...props} = this.props;

        props.onClick = this.handleClick;
        props.className = "track " + (type === 'x' ? "trackX" : "trackY") + (className ? " " + className : "");

        return renderer
               ? renderer(props)
               : (<div { ...props } />);
    }
}
