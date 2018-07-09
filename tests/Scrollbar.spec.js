import React                              from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Scrollbar }                      from "react-scrollbars-custom";

describe('rendering', () => {
    let node;
    beforeEach(() => {
        node = document.createElement('div');
        document.body.appendChild(node);
    });
    afterEach(() => {
        unmountComponentAtNode(node);
        document.body.removeChild(node);
    });

    describe("when <Scrollbar /> is rendered", function () {
        it('renders tracks', (done) => {
            render(<Scrollbar />, node, function () {
                expect(this.trackVertical).to.be.an.instanceof(Node);
                expect(this.trackHorizontal).to.be.an.instanceof(Node);

                done();
            });
        });
        it('renders thumbs', (done) => {
            render(<Scrollbar />, node, function () {
                expect(this.thumbVertical).to.be.an.instanceof(Node);
                expect(this.thumbHorizontal).to.be.an.instanceof(Node);

                done();
            });
        });
        it('renders content wrapper', (done) => {
            render(<Scrollbar />, node, function () {
                expect(this.wrapper).to.be.an.instanceof(Node);

                done();
            });
        });
        it('renders content', (done) => {
            render(<Scrollbar />, node, function () {
                expect(this.content).to.be.an.instanceof(Node);

                done();
            });
        });
    });
});
