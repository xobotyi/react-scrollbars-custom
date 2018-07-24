import dragging       from "./dragging";
import getset         from "./getset";
import rendering      from "./rendering";
import resizing       from "./resizing";
import scrolling      from "./scrolling";
import scrollTriggers from "./scrollTriggers";
import sizeTracking   from "./sizeTracking";

export default function createTests(scrollbarWidth) {
    rendering(scrollbarWidth);
    getset(scrollbarWidth);
    scrolling(scrollbarWidth);
    scrollTriggers(scrollbarWidth);
    resizing(scrollbarWidth);
    dragging(scrollbarWidth);
    sizeTracking(scrollbarWidth);
}
