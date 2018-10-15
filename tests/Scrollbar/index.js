import dragging    from "./dragging";
import getset      from "./getset";
import rendering   from "./rendering";
import tracksClick from "./tracksClick";

export default function performTests() {
    rendering();
    dragging();
    getset();
    tracksClick();
}
