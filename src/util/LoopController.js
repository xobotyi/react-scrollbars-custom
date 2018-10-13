import raf from "raf";

let loopIsActive = false;
let animationFrame = null;
const loopRegister = [];

export const LoopController = {
    registerScrollbar: (scrollbar) => {
        if (!loopRegister.includes(scrollbar)) {
            loopRegister.push(scrollbar);

            loopIsActive = true;
            LoopController.start();
        }
    },

    unregisterScrollbar: (scrollbar) => {
        let index = loopRegister.indexOf(scrollbar);
        if (index !== -1) {
            loopRegister.splice(index, 1);

            loopRegister.length && LoopController.stop();
        }
    },

    start: () => {
        animationFrame = raf(LoopController.rafStep);
    },

    rafStep: () => {
        if (!loopIsActive) {return;}

        loopRegister.forEach(LoopController.registerCrawler);

        animationFrame = raf(LoopController.rafStep);
    },

    registerCrawler: (scrollbar) => {
        scrollbar.update();
    },

    stop: () => {
        loopIsActive = false;

        animationFrame && raf.cancel(animationFrame);
    },
};
