import getset    from "./getset";
import rendering from "./rendering";
import scrolling from "./scrolling";

export default function createTests(scrollbarWidth) {
    rendering(scrollbarWidth);
    getset(scrollbarWidth);
    scrolling(scrollbarWidth);
}
