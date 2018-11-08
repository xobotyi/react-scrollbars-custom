import PropTypes from "prop-types";
import React     from 'react';
import Thumb     from './Thumb';
import Track     from './Track';

export default class Scrollbar extends React.Component
{
    static propTypes = {
        tagName:   PropTypes.string,
        className: PropTypes.string,
        style:     PropTypes.object,

        noDefaultStyles: PropTypes.bool,

        wrapperProps: PropTypes.object,
        contentProps: PropTypes.object,
        trackXProps:  PropTypes.object,
        trackYProps:  PropTypes.object,
        thumbXProps:  PropTypes.object,
        thumbYProps:  PropTypes.object,

        wrapperRenderer: PropTypes.func,
        contentRenderer: PropTypes.func,
        trackXRenderer:  PropTypes.func,
        trackYRenderer:  PropTypes.func,
        thumbXRenderer:  PropTypes.func,
        thumbYRenderer:  PropTypes.func,
    };

    static defaultProps = {
        tagName: "div",

        noDefaultStyles: false,

        wrapperProps: {},
        contentProps: {},
        trackXProps:  {},
        trackYProps:  {},
        thumbXProps:  {},
        thumbYProps:  {},
    };

    render() {
        const {
                  tagName,
                  className,
                  style,

                  noDefaultStyles,

                  wrapperProps,
                  contentProps,
                  trackXProps,
                  trackYProps,
                  thumbXProps,
                  thumbYProps,

                  wrapperRenderer,
                  contentRenderer,
                  trackXRenderer,
                  trackYRenderer,
                  thumbXRenderer,
                  thumbYRenderer,

                  children,
                  ...props
              } = this.props;

        props.style = {...style};
        wrapperProps.style = {...wrapperProps.style};
        contentProps.style = {...contentProps.style};
        trackXProps.style = {...trackXProps.style};
        trackYProps.style = {...trackYProps.style};
        thumbXProps.style = {...thumbXProps.style};
        thumbYProps.style = {...thumbYProps.style};

        props.className = "ScrollbarsCustom" + (className ? " " + className : "");

        trackXProps.renderer = trackXRenderer;
        trackYProps.renderer = trackYRenderer;
        thumbXProps.renderer = thumbXRenderer;
        thumbYProps.renderer = thumbYRenderer;

        contentProps.className = "content" + (contentProps.className ? " " + contentProps.className : "");
        contentProps.children = children;

        wrapperProps.className = "wrapper" + (wrapperProps.className ? " " + wrapperProps.className : "");
        wrapperProps.children = contentRenderer ? contentRenderer(contentProps) : (<div { ...contentProps } />);

        return (
                <this.props.tagName { ...props }>
                    { wrapperRenderer ? wrapperRenderer(wrapperProps) : (<div { ...wrapperProps } />) }

                    <Track type="y" { ...trackYProps }>
                        <Thumb type="y" { ...thumbYProps } />
                    </Track>

                    <Track type="x"{ ...trackXProps }>
                        <Thumb type="x"{ ...thumbXProps } />
                    </Track>
                </this.props.tagName>
        );
    }
}
