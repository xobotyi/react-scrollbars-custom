import PropTypes                                from "prop-types";
import raf                                      from 'raf';
import { Component, createElement }             from 'react';
import { getInnerHeight, getInnerWigth }        from '../util/getInnerSizes';
import { getScrollbarWidth, isFunction, isset } from '../util/utilities';
import * as defaultElementRender                from "./defaultElementRender";
import * as defaultElementStyles                from "./defaultElementStyle";

export default class Scrollbar extends Component
{
    static propTypes = {
        tagName:               PropTypes.string,
        className:             PropTypes.string,
        defaultStyles:         PropTypes.bool,
        renderView:            PropTypes.func,
        renderTrackVertical:   PropTypes.func,
        renderTrackHorizontal: PropTypes.func,
        renderThumbVertical:   PropTypes.func,
        renderThumbHorizontal: PropTypes.func,
        thumbSizeMin:          PropTypes.number,
        onScroll:              PropTypes.func,
        children:              PropTypes.node,
    };

    static defaultProps = {
        tagName:               'div',
        className:             'CustomScrollbar-wrapper',
        defaultStyles:         true,
        thumbSizeMin:          30,
        renderView:            defaultElementRender.scroller,
        renderTrackVertical:   defaultElementRender.trackVertical,
        renderTrackHorizontal: defaultElementRender.trackHorizontal,
        renderThumbVertical:   defaultElementRender.thumbVertical,
        renderThumbHorizontal: defaultElementRender.thumbHorizontal,
    };

    constructor(props, ...rest) {
        super(props, ...rest);

    }

    componentWillUnmount() {
        raf.cancel(this.requestFrame);
    }

    raf(cb) {
        if (isset(this.requestFrame)) {raf.cancel(this.requestFrame);}

        this.requestFrame = raf(() => {
            this.requestFrame = undefined;
            cb();
        });
    }

    update(cb) {
        this.raf(() => this.actualizeScrollbars(cb));
    }

    computeThumbVerticalHeight(trackHeight) {
        const {scrollHeight, clientHeight} = this.scroller;
        const {thumbSizeMin} = this.props;
        const height = Math.ceil(clientHeight / scrollHeight * trackHeight);

        return trackHeight === height ? 0 : Math.max(height, thumbSizeMin);
    }

    computeThumbHorizontalWidth(trackWidth) {
        const {scrollWidth, clientWidth} = this.scroller;
        const {thumbSizeMin} = this.props;
        const width = Math.ceil(scrollWidth / clientWidth * trackWidth);

        return trackWidth === width ? 0 : Math.max(width, thumbSizeMin);
    }

    actualizeScrollbars(cb) {
        const trackHorizontalInnerWidth = getInnerWigth(this.trackHorizontal),
              trackVerticalInnerHeight  = getInnerHeight(this.trackVertical);

        const thumbHorizontalWidth = 0,
              thumbVerticalHeight  = 0;

        if (isFunction(cb)) {
            cb();
        }
    }

    render() {
        const {
                  tagName, thumbSizeMin, children, defaultStyles, style,
                  renderView, renderTrackVertical, renderTrackHorizontal, renderThumbVertical, renderThumbHorizontal,
                  ...props
              } = this.props;

        const browserScrollbarWidth = getScrollbarWidth(),
              wrapperStyle          = {...style, ...(defaultStyles && defaultElementStyles.wrapper)},
              scrollerStyle         = {...(defaultStyles && defaultElementStyles.scroller), marginRight: -browserScrollbarWidth, marginBottom: -browserScrollbarWidth},
              trackVerticalStyle    = {...(defaultStyles && defaultElementStyles.trackVertical)},
              thumbVerticalStyle    = {...(defaultStyles && defaultElementStyles.thumbVertical)},
              trackHorizontalStyle  = {...(defaultStyles && defaultElementStyles.trackHorizontal)},
              thumbHorizontalStyle  = {...(defaultStyles && defaultElementStyles.thumbHorizontal)};

        return createElement(
                tagName,
                {...props, style: wrapperStyle, ref: (ref) => {this.container = ref;}},
                [
                    renderView({
                                   key:   'scroller',
                                   style: scrollerStyle,
                                   ref:   (ref) => {this.scroller = ref;},
                                   children,
                               }),
                    renderTrackVertical({
                                            key:      'trackVertical',
                                            style:    trackVerticalStyle,
                                            ref:      (ref) => {this.trackVertical = ref;},
                                            children: renderThumbVertical({
                                                                              key:   'thumbVertical',
                                                                              style: thumbVerticalStyle,
                                                                              ref:   (ref) => {this.thumbVertical = ref;},
                                                                          }),
                                        }),
                    renderTrackHorizontal({
                                              key:      'trackHorizontal',
                                              style:    trackHorizontalStyle,
                                              ref:      (ref) => {this.trackHorizontal = ref;},
                                              children: renderThumbHorizontal({
                                                                                  key:   'thumbHorizontal',
                                                                                  style: thumbHorizontalStyle,
                                                                                  ref:   (ref) => {this.thumbHorizontal = ref;},
                                                                              }),
                                          }),
                ],
        );
    }
}