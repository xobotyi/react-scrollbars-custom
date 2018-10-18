import { Component, CSSProperties, SFC } from "react";

export interface ScrollbarRendererProps {
    className?: string | string[];
    style?: CSSProperties;
}

export interface ScrollValues {
    scrollTop: number;
    scrollLeft: number;
    scrollHeight: number;
    scrollWidth: number;
    clientHeight: number;
    clientWidth: number;
}

export interface ScrollbarProps {
    minimalThumbsSize?: number;
    fallbackScrollbarWidth?: number;

    rtl?: boolean;
    momentum?: boolean;
    defaultStyles?: boolean;

    permanentScrollbars?: boolean;
    permanentScrollbarX?: boolean;
    permanentScrollbarY?: boolean;

    noScroll?: boolean;
    noScrollX?: boolean;
    noScrollY?: boolean;

    tagName?: string;

    className?: string | string[];
    wrapperClassName?: string | string[];
    contentClassName?: string | string[];
    trackVerticalClassName?: string | string[];
    trackHorizontalClassName?: string | string[];
    thumbVerticalClassName?: string | string[];
    thumbHorizontalClassName?: string | string[];

    style?: CSSProperties;
    wrapperStyle?: CSSProperties;
    contentStyle?: CSSProperties;
    trackVerticalStyle?: CSSProperties;
    trackHorizontalStyle?: CSSProperties;
    thumbVerticalStyle?: CSSProperties;
    thumbHorizontalStyle?: CSSProperties;

    onScroll?(current: ScrollValues, instance: Scrollbar): void;
    onScrollStart?(instance: Scrollbar): void;
    onScrollStop?(instance: Scrollbar): void;
    scrollDetectionThreshold?: number;

    renderWrapper?: SFC<ScrollbarRendererProps>;
    renderContent?: SFC<ScrollbarRendererProps>;
    renderTrackVertical?: SFC<ScrollbarRendererProps>;
    renderTrackHorizontal?: SFC<ScrollbarRendererProps>;
    renderThumbVertical?: SFC<ScrollbarRendererProps>;
    renderThumbHorizontal?: SFC<ScrollbarRendererProps>;
}

declare class Scrollbar extends Component<ScrollbarProps> {
    public scrollTop: number;
    public scrollLeft: number;
    public readonly scrollHeight: number;
    public readonly scrollWidth: number;
    public readonly clientHeight: number;
    public readonly clientWidth: number;
    /**
     * Scroll to the top border.
     *
     * @returns The scrollbar instance
     */
    public scrollToTop(): Scrollbar;
    /**
     * Scroll to the bottom border.
     *
     * @returns The scrollbar instance
     */
    public scrollToBottom(): Scrollbar;
    /**
     * Scroll to the left border.
     *
     * @returns The scrollbar instance
     */
    public scrollToLeft(): Scrollbar;
    /**
     * Scroll to the right border.
     *
     * @returns The scrollbar instance
     */
    public scrollToRight(): Scrollbar;
    /**
     * Updates the scrollbars. By default, this does nothing if content and
     * wrapper sizes are unchanged.
     *
     * @param forced Whether to update the scrollbars even if nothing changed.
     * @param rtlAutodetect Whether to check CSS direction value.
     *
     * @returns The scrollbar instance.
     */
    public update(forced?: boolean, rtlAutodetect?: boolean): Scrollbar;
}

export default Scrollbar;
