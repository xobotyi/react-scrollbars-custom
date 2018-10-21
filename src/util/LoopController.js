function LoopControllerClass() {
    /**
     * @typedef {Object} Scrollbar
     * @property {function} update
     */

    /**
     * @type {Scrollbar[]}
     */
    const scrollbarsRegister = [];

    /**
     * true if loop is active
     * @type {boolean}
     */
    let isActive = false;
    /**
     * ID of requested animation frame
     * @type {null|number}
     */
    let animationFrameId = null;

    /**
     * Function that called in animation frame
     */
    const animationFrameCallback = () => {
        if (!isActive) {return;}

        for (let scrollbar of scrollbarsRegister) {
            scrollbar.update();
        }

        requestAnimationFrame(animationFrameCallback);
    };

    /**
     * Stop the loop if it wasn't active
     * @return {LoopControllerClass}
     */
    this.start = () => {
        if (isActive) {return this;}

        isActive = true;

        animationFrameId && cancelAnimationFrame(animationFrameId);
        requestAnimationFrame(animationFrameCallback);
    };
    /**
     * Stop the loop if it is active
     * @return {LoopControllerClass}
     */
    this.stop = () => {
        if (!isActive) {return this;}

        isActive = false;

        animationFrameId && cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    };

    /**
     * Return the array pf registered scrollbars
     * @return {Scrollbar[]}
     */
    this.getRegisteredScrollbars = () => {
        return [...scrollbarsRegister];
    };
    /**
     * Add the scrollbar to list to iterate each loop
     * @param {Scrollbar} scrollbar
     * @return {LoopControllerClass}
     */
    this.registerScrollbar = (scrollbar) => {
        if (scrollbarsRegister.indexOf(scrollbar) === -1) {
            scrollbarsRegister.push(scrollbar);

            this.start();
        }

        return this;
    };
    /**
     * Remove the scrollbar from list to iterate each loop
     * @param {Scrollbar} scrollbar
     * @return {LoopControllerClass}
     */
    this.unregisterScrollbar = (scrollbar) => {
        const index = scrollbarsRegister.indexOf(scrollbar);

        if (index !== -1) {
            scrollbarsRegister.splice(index, 1);
        }

        return this;
    };
}

export const LoopController = new LoopControllerClass();
export default LoopController;

/**
 * Return new instance of LoopControllerClass
 * @return {LoopControllerClass}
 */
export function createLoopController() {
    return new LoopControllerClass();
}
