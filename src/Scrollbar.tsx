import * as React from "react";
import * as PropTypes from "prop-types";
import {TrackProps} from "./Track";
import {ThumbProps} from "./Thumb";

type ScrollValues = {
    /**
     * @description Content's native clientHeight parameter
     */
    clientHeight: number;
    /**
     * @description Content's native clientWidth parameter
     */
    clientWidth: number;
    /**
     * @description Content's native scrollHeight parameter
     */
    scrollHeight: number;
    /**
     * @description Content's native scrollWidth parameter
     */
    scrollWidth: number;
    /**
     * @description Content's native scrollTop parameter
     */
    scrollTop: number;
    /**
     * @description Content's native scrollLeft parameter
     */
    scrollLeft: number;
    /**
     * @description Indicates whether vertical scroll blocked via properties
     */
    scrollYBlocked: boolean;
    /**
     * @description Indicates whether horizontal scroll blocked via properties
     */
    scrollXBlocked: boolean;
    /**
     * @description Indicates whether the content overflows vertically and scrolling not blocked
     */
    scrollYPossible: boolean;
    /**
     * @description Indicates whether the content overflows horizontally and scrolling not blocked
     */
    scrollXPossible: boolean;
    /**
     * @description Indicates whether vertical track is visible
     */
    trackYVisible: boolean;
    /**
     * @description Indicates whether horizontal track is visible
     */
    trackXVisible: boolean;
    /**
     * @description Indicates whether display direction is right-to-left
     */
    isRtl: boolean;
};

export enum TRACK_CLICK_BEHAVIOUR {
    JUMP = "jump",
    STEP = "step",
}

export type ElementProps = React.HTMLProps<HTMLDivElement> & {
    elementRef: (element: HTMLElement) => void;
};

export type ScrollbarProps = {
    native?: boolean;

    minimalThumbSize?: number;

    fallbackScrollbarWidth?: number;

    className?: string;
    tagName?: string;
    style?: React.CSSProperties;

    trackClickBehaviour?: TRACK_CLICK_BEHAVIOUR;

    rtl?: boolean;

    momentum?: boolean;

    noDefaultStyles?: boolean;

    scrollDetectionThreshold?: number;

    translateContentSizesToHolder?: boolean;

    scrollTop?: number;
    scrollLeft?: number;

    noScrollX?: boolean;
    noScrollY?: boolean;
    noScroll?: boolean;

    removeTracksWhenNotUsed?: boolean;
    removeTrackYWhenNotUsed?: boolean;
    removeTrackXWhenNotUsed?: boolean;

    permanentTrackX?: boolean;
    permanentTrackY?: boolean;
    permanentTracks?: boolean;

    wrapperProps?: ElementProps;
    contentProps?: ElementProps;
    trackXProps?: TrackProps;
    trackYProps?: TrackProps;
    thumbXProps?: ThumbProps;
    thumbYProps?: ThumbProps;

    wrapperRenderer?: React.FunctionComponent<ElementProps>;
    contentRenderer?: React.FunctionComponent<ElementProps>;
    trackXRenderer?: React.FunctionComponent<TrackProps>;
    trackYRenderer?: React.FunctionComponent<TrackProps>;
    thumbXRenderer?: React.FunctionComponent<ThumbProps>;
    thumbYRenderer?: React.FunctionComponent<ThumbProps>;

    onScroll?: void;
    onScrollStart?: void;
    onScrollStop?: void;
};

export enum DIRECTION_AXIS {
    X = 1,
    Y = 2,
}

export default class Scrollbar extends React.Component<ScrollbarProps> {
    public static propTypes = {
        native: PropTypes.bool,

        minimalThumbsSize: PropTypes.number,

        fallbackScrollbarWidth: PropTypes.number,

        tagName: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,

        trackClickBehavior: PropTypes.oneOf([TRACK_CLICK_BEHAVIOUR.JUMP, TRACK_CLICK_BEHAVIOUR.STEP]),

        rtl: PropTypes.bool,

        momentum: PropTypes.bool,

        noDefaultStyles: PropTypes.bool,

        scrollDetectionThreshold: PropTypes.number,

        translateContentSizesToHolder: PropTypes.bool,

        scrollTop: PropTypes.number,
        scrollLeft: PropTypes.number,

        noScrollX: PropTypes.bool,
        noScrollY: PropTypes.bool,
        noScroll: PropTypes.bool,

        removeTracksWhenNotUsed: PropTypes.bool,
        removeTrackYWhenNotUsed: PropTypes.bool,
        removeTrackXWhenNotUsed: PropTypes.bool,

        permanentTrackX: PropTypes.bool,
        permanentTrackY: PropTypes.bool,
        permanentTracks: PropTypes.bool,

        wrapperProps: PropTypes.object,
        contentProps: PropTypes.object,
        trackXProps: PropTypes.object,
        trackYProps: PropTypes.object,
        thumbXProps: PropTypes.object,
        thumbYProps: PropTypes.object,

        wrapperRenderer: PropTypes.func,
        contentRenderer: PropTypes.func,
        trackXRenderer: PropTypes.func,
        trackYRenderer: PropTypes.func,
        thumbXRenderer: PropTypes.func,
        thumbYRenderer: PropTypes.func,

        onScroll: PropTypes.func,
        onScrollStart: PropTypes.func,
        onScrollStop: PropTypes.func,
    };

    public static defaultProps = {
        native: false,

        tagName: "div",

        minimalThumbsSize: 30,

        fallbackScrollbarWidth: 20,

        trackClickBehavior: TRACK_CLICK_BEHAVIOUR.JUMP,

        momentum: true,

        noDefaultStyles: false,

        scrollDetectionThreshold: 100,

        translateContentSizesToHolder: false,

        noScrollX: false,
        noScrollY: false,
        noScroll: false,

        permanentTrackX: false,
        permanentTrackY: false,
        permanentTracks: false,

        removeTracksWhenNotUsed: true,
        removeTrackYWhenNotUsed: true,
        removeTrackXWhenNotUsed: true,

        wrapperProps: {},
        contentProps: {},
        trackXProps: {},
        trackYProps: {},
        thumbXProps: {},
        thumbYProps: {},
    };

    update = () => {};

    render() {
        return <div />;
    }
}
