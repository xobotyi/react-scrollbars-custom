interface UpdatableItem {
    _unmounted?: boolean;
    update: () => any;
}
export declare class RAFLoop {
    /**
     * @description List of targets to update
     */
    private readonly targets;
    /**
     * @description ID of requested animation frame. Valuable only if loop is active and has items to iterate.
     */
    private animationFrameID;
    /**
     * @description Loop's state.
     */
    private _isActive;
    /**
     * @description Loop's state.
     */
    get isActive(): boolean;
    /**
     * @description Start the loop if it wasn't yet.
     */
    start: () => this;
    /**
     * @description Stop the loop if is was active.
     */
    stop: () => this;
    /**
     * @description Add target to the iteration list if it's not there.
     */
    addTarget: (target: UpdatableItem, silent?: boolean) => this;
    /**
     * @description Remove target from iteration list if it was there.
     */
    removeTarget: (target: UpdatableItem) => this;
    /**
     * @description Callback that called each animation frame.
     */
    private rafCallback;
}
declare const _default: RAFLoop;
export default _default;
