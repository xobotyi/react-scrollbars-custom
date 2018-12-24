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
        renderer: PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    onClickHandler = ev => {
        if (ev.target !== this.element || !this.props.onClick) {
            return true;
        }

        const rect = this.element.getBoundingClientRect();

        this.props.onClick(ev, {
            axis: this.props.type,
            offset: this.props.type === TYPE_X ? ev.clientX - rect.left : ev.clientY - rect.top,
        });
    };

    render() {
        const {className, renderer, type, elementRef, onClick, ...props} = this.props;

        props.className = "track " + (type === TYPE_X ? "trackX" : "trackY") + (className ? " " + className : "");
        props.onClick = this.onClickHandler;

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
