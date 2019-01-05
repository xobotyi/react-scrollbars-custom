import * as React from "react";
import * as PropTypes from "prop-types";
declare type NativeScrollbarProps = {
    rtl?: boolean;
    momentum?: boolean;
    permanentTrackX?: boolean;
    permanentTrackY?: boolean;
    permanentTracks?: boolean;
    noScrollX?: boolean;
    noScrollY?: boolean;
    noScroll?: boolean;
    tagName?: string;
    className?: string;
    style?: React.CSSProperties;
    elementRef?: (element: HTMLElement | null) => void;
};
export default class NativeScrollbar extends React.Component<NativeScrollbarProps> {
    static displayName: string;
    static propTypes: {
        rtl: PropTypes.Requireable<boolean>;
        momentum: PropTypes.Requireable<boolean>;
        permanentTrackX: PropTypes.Requireable<boolean>;
        permanentTrackY: PropTypes.Requireable<boolean>;
        permanentTracks: PropTypes.Requireable<boolean>;
        noScrollX: PropTypes.Requireable<boolean>;
        noScrollY: PropTypes.Requireable<boolean>;
        noScroll: PropTypes.Requireable<boolean>;
        tagName: PropTypes.Requireable<string>;
        className: PropTypes.Requireable<string>;
        style: PropTypes.Requireable<object>;
        elementRef: PropTypes.Requireable<(...args: any[]) => any>;
    };
    static defaultProps: {
        tagName: string;
    };
    private element;
    render(): JSX.Element;
}
export {};
