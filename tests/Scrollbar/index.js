import dragging  from "./dragging";
import getset    from "./getset";
import rendering from "./rendering";

export default function performTests() {
    rendering();
    dragging();
    getset();
}
