"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdateLoop {
    constructor() {
        /**
         * @description List of scrollbars to update
         */
        this.targets = [];
        /**
         * @description ID of requested animation frame. Valuable only if loop is active and has items to iterate.
         */
        this.animationFrameID = null;
        /**
         * @description Loop's state.
         */
        this._isActive = false;
        /**
         * @description Callback that called each animation frame.
         */
        this.frameRequestCallback = () => {
            if (!this._isActive) {
                return;
            }
            // as it turned out: https://jsperf.com/iterable-storages-performance
            // classic 'for' over the array is fastest for most of the browsers
            for (let i = 0; i < this.targets.length; i++) {
                this.targets[i].update();
            }
            this.animationFrameID = requestAnimationFrame(this.frameRequestCallback);
        };
        /**
         * @description Start te loop if it wasn't yet.
         */
        this.start = () => {
            if (!this._isActive) {
                this._isActive = true;
                this.animationFrameID && cancelAnimationFrame(this.animationFrameID);
                this.animationFrameID = requestAnimationFrame(this.frameRequestCallback);
            }
            return this;
        };
        /**
         * @description Stop the loop if is was active.
         */
        this.stop = () => {
            if (this._isActive) {
                this._isActive = false;
                this.animationFrameID && cancelAnimationFrame(this.animationFrameID);
                this.animationFrameID = null;
            }
            return this;
        };
    }
    /**
     * @description Loop's state.
     */
    get isActive() {
        return Boolean(this._isActive);
    }
    ;
    /**
     * @description Add scrollbar to iteration list if it wasn't yet.
     */
    addScrollbar(scrollbar) {
        if (this.targets.indexOf(scrollbar) === -1) {
            this.targets.push(scrollbar);
        }
        this.targets.length === 1 && this.start();
        return this;
    }
    /**
     * @description Remove scrollbar from iteration list if it was there.
     */
    removeScrollbar(scrollbar) {
        const index = this.targets.indexOf(scrollbar);
        this.targets.length === 1 && this.stop();
        if (index !== -1) {
            this.targets.splice(index, 1);
        }
        return this;
    }
}
exports.UpdateLoop = UpdateLoop;
