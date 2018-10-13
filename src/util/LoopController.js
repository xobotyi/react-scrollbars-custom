import raf from "raf";

let loopIsActive = false;
let animationFrame = null;
const loopRegister = [];

class LoopController
{
    constructor() {
        this.rafStep = this.rafStep.bind(this);
    }

    registerScrollbar(scrollbar) {
        if (!loopRegister.includes(scrollbar)) {
            loopRegister.push(scrollbar);

            loopIsActive = true;
            this.start();
        }

        return this;
    };

    unregisterScrollbar(scrollbar) {
        let index = loopRegister.indexOf(scrollbar);

        if (index !== -1) {
            loopRegister.splice(index, 1);

            loopRegister.length && this.stop();
        }

        return this;
    };

    start() {
        animationFrame = raf(this.rafStep);

        return this;
    };

    rafStep() {
        if (!loopIsActive) {return;}

        loopRegister.forEach(LoopController.registerCrawler);

        animationFrame = raf(this.rafStep);
    };

    static registerCrawler(scrollbar) {
        scrollbar.update();
    };

    stop() {
        loopIsActive = false;

        animationFrame && raf.cancel(animationFrame);

        return this;
    };
}

const instance = new LoopController();

export default instance;
