import { getScrollbarWidth } from "./../src/util/utilities";
import createTests           from "./Scrollbars";

describe("on desktop browser", () => {
    createTests(getScrollbarWidth());
});
