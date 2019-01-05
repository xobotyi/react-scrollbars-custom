import Scrollbar from "./Scrollbar";
export declare class UpdateLoop {
    /**
     * @description List of scrollbars to update
     */
    protected readonly targets: Scrollbar[];
    /**
     * @description ID of requested animation frame. Valuable only if loop is active and has items to iterate.
     */
    protected animationFrameID: number | null;
    /**
     * @description Loop's state.
     */
    protected _isActive: boolean;
    /**
     * @description Loop's state.
     */
    readonly isActive: boolean;
    /**
     * @description Start te loop if it wasn't yet.
     */
    start: () => UpdateLoop;
    /**
     * @description Stop the loop if is was active.
     */
    stop: () => UpdateLoop;
    /**
     * @description Add scrollbar to iteration list if it wasn't yet.
     */
    addScrollbar(scrollbar: Scrollbar): UpdateLoop;
    /**
     * @description Remove scrollbar from iteration list if it was there.
     */
    removeScrollbar(scrollbar: Scrollbar): UpdateLoop;
    /**
     * @description Callback that called each animation frame.
     */
    protected frameRequestCallback: () => void;
}
