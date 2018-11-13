import getset from "./Scrollbar/getset";
import rendering from "./Scrollbar/rendering";
import staticMethods from "./Scrollbar/staticMethods";

describe("Scrollbar (desktop)", () => {
    staticMethods();
    rendering();
    getset();
});
