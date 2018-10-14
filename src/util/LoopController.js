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

            this.start();
        }

        return this;
    };

    unregisterScrollbar(scrollbar) {
        let index = loopRegister.indexOf(scrollbar);

        if (index !== -1) {
            loopRegister.length === 1 && this.stop();

            loopRegister.splice(index, 1);
        }

        return this;
    };

    start() {
        if (!loopIsActive) {
            loopIsActive = true;

            animationFrame && cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(this.rafStep);
        }

        return this;
    };

    rafStep() {
        if (!loopIsActive) {return;}

        for (let i = 0; i < loopRegister.length; i++) {
            loopRegister[i].update();
        }

        animationFrame = requestAnimationFrame(this.rafStep);
    };

    stop() {
        if (loopIsActive) {
            loopIsActive = false;

            animationFrame && cancelAnimationFrame(animationFrame);
        }

        return this;
    };
}

const instance = new LoopController();

export default instance;
