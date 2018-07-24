import expect                             from "expect";
import React                              from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Scrollbar }                      from "react-scrollbars-custom";
import sinon                              from 'sinon';

class TestComponent extends React.Component
{
    constructor(props, ...rest) {
        super(props, rest);

        this.state = {
            sizeTracking:     true,
            trackingInterval: 100,
        };
    }

    render() {
        const {sizeTracking, trackingInterval} = this.state;

        return <Scrollbar ref={ ref => this.scrollbar = ref } style={ {width: 100, height: 100} } contentSizeTrack={ sizeTracking } contentSizeTrackInterval={ trackingInterval }>
            <div style={ {width: 200, height: 200} }></div>
        </Scrollbar>;
    }
}

export default function createTests(scrollbarWidth) {
    describe("size tracking", () => {
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
            it("update should be triggered if content's sizes changed", (done) => {
                render(<TestComponent />,
                        node,
                        function () {
                            setTimeout(() => {
                                const updateSpy = sinon.spy(Scrollbar.prototype, 'update');
                                const div = this.scrollbar.content.children[0];

                                div.style.height = '500px';

                                setTimeout(() => {
                                    expect(updateSpy.callCount).toBe(1);

                                    updateSpy.restore();
                                    done();
                                }, 110);
                            }, 100);
                        });
            });

            it("tracking should be stopped when prop updated and false", (done) => {
                render(<TestComponent />,
                        node,
                        function () {
                            setTimeout(() => {
                                const sizeTrackStopSpy = sinon.spy(Scrollbar.prototype, 'contentSizeTrackStop');

                                this.setState({...this.state, sizeTracking: false});

                                expect(sizeTrackStopSpy.callCount).toBe(1);

                                sizeTrackStopSpy.restore();
                                done();
                            }, 100);
                        });
            });

            it("tracking should be started when prop updated and true", (done) => {
                render(<TestComponent />,
                        node,
                        function () {
                            this.setState({...this.state, sizeTracking: false});

                            setTimeout(() => {
                                const sizeTrackStartSpy = sinon.spy(Scrollbar.prototype, 'contentSizeTrackStart');

                                this.setState({...this.state, sizeTracking: true});

                                expect(sizeTrackStartSpy.callCount).toBe(1);

                                sizeTrackStartSpy.restore();
                                done();
                            }, 100);
                        });
            });

            it("tracking should be restarted when interval changed", (done) => {
                render(<TestComponent />,
                        node,
                        function () {
                            setTimeout(() => {
                                const sizeTrackStopSpy = sinon.spy(Scrollbar.prototype, 'contentSizeTrackStop');
                                const sizeTrackStartSpy = sinon.spy(Scrollbar.prototype, 'contentSizeTrackStart');

                                this.setState({...this.state, trackingInterval: 50});

                                expect(sizeTrackStopSpy.callCount).toBe(1);
                                expect(sizeTrackStartSpy.callCount).toBe(1);

                                sizeTrackStopSpy.restore();
                                sizeTrackStartSpy.restore();

                                done();
                            }, 100);
                        });
            });
        });
    });
}
