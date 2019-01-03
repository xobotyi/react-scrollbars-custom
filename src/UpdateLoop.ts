import Scrollbar from "./Scrollbar";

export class UpdateLoop {
    /**
     * @description List of scrollbars to update
     */
    protected readonly targets: Scrollbar[] = [];

    /**
     * @description ID of requested animation frame. Valuable only if loop is active and has items to iterate.
     */
    protected animationFrameID: number | null = null;

    /**
     * @description Loop's state.
     */
    protected _isActive: boolean = false;

    /**
     * @description Loop's state.
     */
    public get isActive() {
        return Boolean(this._isActive)
    };

    /**
     * @description Callback that called each animation frame.
     */
    protected frameRequestCallback = () => {
        if (!this._isActive) {return;}

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
    public start = (): UpdateLoop => {
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
    public stop = (): UpdateLoop => {
        if (this._isActive) {
            this._isActive = false;

            this.animationFrameID && cancelAnimationFrame(this.animationFrameID);
            this.animationFrameID = null;
        }

        return this;
    };

    /**
     * @description Add scrollbar to iteration list if it wasn't yet.
     */
    public addScrollbar(scrollbar: Scrollbar): UpdateLoop {
        if (this.targets.indexOf(scrollbar) === -1) {
            this.targets.push(scrollbar);
        }

        this.targets.length === 1 && this.start();

        return this;
    }

    /**
     * @description Remove scrollbar from iteration list if it was there.
     */
    public removeScrollbar(scrollbar: Scrollbar): UpdateLoop {
        const index = this.targets.indexOf(scrollbar);

        this.targets.length === 1 && this.stop();

        if (index !== -1) {
            this.targets.splice(index, 1);
        }

        return this;
    }
}
