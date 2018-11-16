import getset from "./Scrollbar/getset";
import rendering from "./Scrollbar/rendering";
import staticMethods from "./Scrollbar/staticMethods";
import callbacks from "./Scrollbar/callbacks";
import trackInteraction from "./Scrollbar/trackInteraction";

describe("Scrollbar (desktop)", () => {
    staticMethods();
    rendering();
    getset();
    callbacks();
    trackInteraction();
});
