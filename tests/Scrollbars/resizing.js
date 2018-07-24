import expect                             from "expect";
import React                              from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Scrollbar }                      from "react-scrollbars-custom";
import simulant                           from "simulant";
import sinon                              from "sinon";

export default function createTests(scrollbarWidth) {
    describe("resizing", () => {
        let node;

        beforeEach(() => {
            node = document.createElement("div");
            document.body.appendChild(node);
        });
        afterEach(() => {
            unmountComponentAtNode(node);
            document.body.removeChild(node);
        });

        describe("when window resized", function () {
            it("scrollbars should update", (done) => {
                render(<Scrollbar style={ {width: 100, height: 100} } gridless>
                            <div style={ {width: 200, height: 200} }></div>
                        </Scrollbar>,
                        node,
                        function () {
                            const updateSpy = sinon.spy(Scrollbar.prototype, 'update');

                            simulant.fire(window, 'resize');

                            expect(updateSpy.callCount).toBe(1);

                            updateSpy.restore();
                            done();
                        });
            });
        });
    });
}
