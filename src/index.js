import PropTypes                         from "prop-types";
import React                             from 'react';
import Thumb                             from './Thumb';
import Track                             from './Track';
import BitSet                            from "./util/BitSet";
import { getInnerHeight, getInnerWidth } from "./util/getInnerSizes";
import LoopController                    from "./util/LoopController";

export default class Scrollbar extends React.Component
{
    static propTypes = {
        minimalThumbsSize:      PropTypes.number,
        fallbackScrollbarWidth: PropTypes.number,

        tagName:   PropTypes.string,
        className: PropTypes.string,
        style:     PropTypes.object,

        noDefaultStyles: PropTypes.bool,
        noScrollX:       PropTypes.bool,
        noScrollY:       PropTypes.bool,
        noScroll:        PropTypes.bool,

        removeTracksWhenNotUsed: PropTypes.bool,
        removeTrackYWhenNotUsed: PropTypes.bool,
        removeTrackXWhenNotUsed: PropTypes.bool,

        permanentTrackX: PropTypes.bool,
        permanentTrackY: PropTypes.bool,
        permanentTracks: PropTypes.bool,

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
        tagName:                "div",
        minimalThumbsSize:      30,
        fallbackScrollbarWidth: 20,

        noDefaultStyles: false,

        noScrollX: false,
        noScrollY: false,
        noScroll:  false,

        permanentTrackX: false,
        permanentTrackY: false,
        permanentTracks: false,

        removeTracksWhenNotUsed: true,
        removeTrackYWhenNotUsed: true,
        removeTrackXWhenNotUsed: true,

        wrapperProps: {},
        contentProps: {},
        trackXProps:  {},
        trackYProps:  {},
        thumbXProps:  {},
        thumbYProps:  {},
    };

    constructor(props) {
        super(props);

        this.previousScrollValues = {
            clientHeight: null,
            clientWidth:  null,
            scrollHeight: null,
            scrollWidth:  null,
            scrollTop:    null,
            scrollLeft:   null,
        };

        this.state = {
            trackYVisible: true,
            trackXVisible: true,
        };
    }

    componentDidMount() {
        //let a = performance.now();
        //for (let i = 0; i < 1000000; i++) {
        //    this.update();
        //}
        //let b = performance.now();
        //console.log((b - a).toFixed(4), (1000000 * 1000 / (b - a)).toFixed(4));
        //LoopController.registerScrollbar(this);
        this.update();
    }

    componentWillUnmount() {
        LoopController.unregisterScrollbar(this);
    }

    update = (forced = false) => {
        const currentScrollValues = {
            clientHeight: this.contentEl.clientHeight * 1,
            scrollHeight: this.contentEl.scrollHeight * 1,
            scrollTop:    this.contentEl.scrollTop * 1,
            clientWidth:  this.contentEl.clientWidth * 1,
            scrollWidth:  this.contentEl.scrollWidth * 1,
            scrollLeft:   this.contentEl.scrollLeft * 1,
        };
        currentScrollValues.scrollYBlocked = !this.props.noScroll && !this.props.noScrollY;
        currentScrollValues.scrollXBlocked = !this.props.noScroll && !this.props.noScrollX;
        currentScrollValues.scrollYPossible = !currentScrollValues.scrollYBlocked && currentScrollValues.scrollHeight > currentScrollValues.clientHeight;
        currentScrollValues.scrollXPossible = !currentScrollValues.scrollXBlocked && currentScrollValues.scrollWidth > currentScrollValues.clientWidth;
        currentScrollValues.trackYVisible = currentScrollValues.scrollYPossible || this.props.permanentTracks || this.props.permanentTrackY;
        currentScrollValues.trackXVisible = currentScrollValues.scrollXPossible || this.props.permanentTracks || this.props.permanentTrackX;

        const mask = new BitSet(
                this.previousScrollValues.clientHeight !== currentScrollValues.clientHeight,
                this.previousScrollValues.clientWidth !== currentScrollValues.clientWidth,
                this.previousScrollValues.scrollHeight !== currentScrollValues.scrollHeight,
                this.previousScrollValues.scrollWidth !== currentScrollValues.scrollWidth,
                this.previousScrollValues.scrollTop !== currentScrollValues.scrollTop,
                this.previousScrollValues.scrollLeft !== currentScrollValues.scrollLeft,
                this.previousScrollValues.scrollYBlocked !== currentScrollValues.scrollYBlocked,
                this.previousScrollValues.scrollXBlocked !== currentScrollValues.scrollXBlocked,
                this.previousScrollValues.scrollYPossible !== currentScrollValues.scrollYPossible,
                this.previousScrollValues.scrollXPossible !== currentScrollValues.scrollXPossible,
                this.previousScrollValues.trackYVisible !== currentScrollValues.trackYVisible,
                this.previousScrollValues.trackXVisible !== currentScrollValues.trackXVisible,
        );

        // if not forced and nothing has changed - do not update
        if (mask.isEmpty() && !forced) { return false; }

        if (mask.anyOf(10, 11)) {
            this.setState({
                              trackYVisible: currentScrollValues.trackYVisible,
                              trackXVisible: currentScrollValues.trackXVisible,
                          });
            this.previousScrollValues.trackYVisible = currentScrollValues.trackYVisible;
            this.previousScrollValues.trackXVisible = currentScrollValues.trackXVisible;

            return;
        }

        // if Y track rendered and changed anything related to scrollY
        if (this.trackYEl) {
            mask.test(10) && (this.trackYEl.style.display = currentScrollValues.trackYVisible ? null : "none");

            if (mask.anyOf(0, 2, 4, 6, 8)) {
                if (currentScrollValues.scrollYPossible) {
                    const trackSize = getInnerHeight(this.trackYEl);
                    const thumbSize = this.computeThumbSize(trackSize,
                                                            currentScrollValues.scrollHeight,
                                                            currentScrollValues.clientHeight);
                    const thumbOffset = this.computeThumbOffset(trackSize,
                                                                thumbSize,
                                                                currentScrollValues.scrollHeight,
                                                                currentScrollValues.clientHeight,
                                                                currentScrollValues.scrollTop);

                    this.thumbYEl.style.transform = `translateY(${thumbOffset}px)`;
                    this.thumbYEl.style.height = thumbSize + 'px';
                    this.thumbYEl.style.display = null;
                }
                else {
                    this.thumbYEl.style.transform = null;
                    this.thumbYEl.style.height = "0px";
                    this.thumbYEl.style.display = "none";
                }
            }
        }

        // if X track rendered and changed anything related to scrollX
        if (this.trackXEl) {
            mask.test(11) && (this.trackXEl.style.display = currentScrollValues.trackXVisible ? null : "none");

            if (mask.anyOf(1, 3, 5, 7, 9)) {
                if (currentScrollValues.scrollYPossible) {
                    const trackSize = getInnerWidth(this.trackXEl);
                    const thumbSize = this.computeThumbSize(trackSize,
                                                            currentScrollValues.scrollWidth,
                                                            currentScrollValues.clientWidth);
                    const thumbOffset = this.computeThumbOffset(trackSize,
                                                                thumbSize,
                                                                currentScrollValues.scrollWidth,
                                                                currentScrollValues.clientWidth,
                                                                currentScrollValues.scrollLeft);

                    this.thumbXEl.style.transform = `translateX(${thumbOffset}px)`;
                    this.thumbXEl.style.width = thumbSize + 'px';
                    this.thumbXEl.style.display = null;
                }
                else {
                    this.thumbXEl.style.transform = null;
                    this.thumbXEl.style.width = "0px";
                    this.thumbXEl.style.display = "none";
                }
            }
        }

        this.previousScrollValues = currentScrollValues;
    };

    computeThumbSize(trackSize, scrollSize, viewportSize) {
        const size = Math.ceil((viewportSize / scrollSize) * trackSize);

        return trackSize === size ? 0 : Math.max(size, this.props.minimalThumbsSize);
    }

    computeThumbOffset(trackSize, thumbSize, scrollSize, viewportSize, scrollValue) {
        return thumbSize && ((scrollValue / (scrollSize - viewportSize)) * (trackSize - thumbSize));
    }

    render() {
        const {
                  minimalThumbsSize,
                  fallbackScrollbarWidth,

                  tagName,
                  className,
                  style,

                  noDefaultStyles,

                  noScrollX,
                  noScrollY,
                  noScroll,

                  permanentTrackX,
                  permanentTrackY,
                  permanentTracks,

                  removeTracksWhenNotUsed,
                  removeTrackYWhenNotUsed,
                  removeTrackXWhenNotUsed,

                  wrapperProps: propsWrapperProps,
                  contentProps: propsContentProps,
                  trackXProps: propsTrackXProps,
                  trackYProps: propsTrackYProps,
                  thumbXProps: propsThumbXProps,
                  thumbYProps: propsThumbYProps,

                  wrapperRenderer,
                  contentRenderer,
                  trackXRenderer,
                  trackYRenderer,
                  thumbXRenderer,
                  thumbYRenderer,

                  children,
                  ...props
              } = this.props;
        const {trackXVisible, trackYVisible} = this.state;

        const wrapperProps = {...propsWrapperProps},
              contentProps = {...propsContentProps},
              trackXProps  = {...propsTrackXProps},
              trackYProps  = {...propsTrackYProps},
              thumbXProps  = {...propsThumbXProps},
              thumbYProps  = {...propsThumbYProps};

        props.style = {...style};
        wrapperProps.style = {
            ...wrapperProps.style,
            position: "relative",
            overflow: "hidden",
        };
        contentProps.style = {
            position:  "absolute",
            top:       0,
            bottom:    0,
            right:     0,
            left:      0,
            ...contentProps.style,
            overflowX: "hidden",
            overflowY: "scroll",
        };
        trackXProps.style = {...trackXProps.style};
        trackYProps.style = {...trackYProps.style};
        thumbXProps.style = {...thumbXProps.style};
        thumbYProps.style = {...thumbYProps.style};

        props.className = "ScrollbarsCustom" + (className ? " " + className : "");
        contentProps.className = "content" + (contentProps.className ? " " + contentProps.className : "");
        wrapperProps.className = "wrapper" + (wrapperProps.className ? " " + wrapperProps.className : "");

        props.ref = (ref) => { this.holderEl = ref; };
        wrapperProps.ref = (ref) => { this.wrapperEl = ref; };
        contentProps.ref = (ref) => { this.contentEl = ref; };
        trackXProps.elementRef = (ref) => { this.trackXEl = ref; };
        trackYProps.elementRef = (ref) => { this.trackYEl = ref; };
        thumbXProps.elementRef = (ref) => { this.thumbXEl = ref; };
        thumbYProps.elementRef = (ref) => { this.thumbYEl = ref; };

        trackXProps.renderer = trackXRenderer;
        trackYProps.renderer = trackYRenderer;
        thumbXProps.renderer = thumbXRenderer;
        thumbYProps.renderer = thumbYRenderer;

        contentProps.children = children;

        wrapperProps.children = contentRenderer ? contentRenderer(contentProps) : (<div { ...contentProps } />);

        return (
                <this.props.tagName { ...props }>
                    { wrapperRenderer ? wrapperRenderer(wrapperProps) : (<div { ...wrapperProps } />) }

                    { (trackYVisible || !(removeTracksWhenNotUsed && removeTrackYWhenNotUsed)) && (
                            <Track type="y" { ...trackYProps }>
                                <Thumb type="y" { ...thumbYProps } />
                            </Track>
                    ) }

                    { (trackXVisible || !(removeTracksWhenNotUsed && removeTrackXWhenNotUsed)) && (
                            <Track type="x"{ ...trackXProps }>
                                <Thumb type="x"{ ...thumbXProps } />
                            </Track>
                    ) }
                </this.props.tagName>
        );
    }
}
