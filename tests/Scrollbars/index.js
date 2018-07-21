import rendering from "./rendering";
import getset from "./getset";
import scrolling from "./scrolling";

export default function createTests(scrollbarWidth) {
    rendering(scrollbarWidth);
    getset(scrollbarWidth);
    scrolling(scrollbarWidth);
}
