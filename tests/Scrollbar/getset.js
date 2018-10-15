import expect                             from "expect";
import React                              from "react";
import { render, unmountComponentAtNode } from "react-dom";
import Scrollbar                          from "react-scrollbars-custom";

export default function performTests() {
    describe("getset", () => {
        let node;
        beforeEach(() => {
            node = document.createElement("div");
            document.body.appendChild(node);
        });
        afterEach(() => {
            unmountComponentAtNode(node);
            document.body.removeChild(node);
        });

        let sbRender = (cb) => render(<Scrollbar style={ {width: 100, height: 100} }>
                    <div style={ {width: 200, height: 200} }/>
                </Scrollbar>,
                node,
                cb);

        describe("getters", function () {
            it("should return scrollTop",
               (done) => sbRender(function () {
                   this.scrollTop = 50;
                   expect(this.scrollTop).toBe(50);
                   expect(this.content.scrollTop).toBe(50);

                   done();
               }));

            it("should return scrollLeft",
               (done) => sbRender(function () {
                   this.scrollLeft = 50;
                   expect(this.scrollLeft).toBe(50);
                   expect(this.content.scrollLeft).toBe(50);

                   done();
               }));

            it("should return scrollHeight",
               (done) => sbRender(function () {
                   expect(this.scrollHeight).toBe(200);
                   expect(this.content.scrollHeight).toBe(200);

                   done();
               }));

            it("should return scrollWidth",
               (done) => sbRender(function () {
                   expect(this.scrollWidth).toBe(200);
                   expect(this.content.scrollWidth).toBe(200);

                   done();
               }));

            it("should return clientHeight",
               (done) => sbRender(function () {
                   expect(this.clientHeight).toBe(100);
                   expect(this.content.clientHeight).toBe(100);

                   done();
               }));

            it("should return clientWidth",
               (done) => sbRender(function () {
                   expect(this.clientWidth).toBe(100);
                   expect(this.content.clientWidth).toBe(100);

                   done();
               }));
        });

        describe("setters", function () {
            it("scrollTop/scrollToTop/scrollToBottom",
               (done) => sbRender(function () {
                   this.scrollTop = 50;
                   expect(this.scrollTop).toBe(50);
                   expect(this.content.scrollTop).toBe(50);
                   this.scrollToTop();
                   expect(this.content.scrollTop).toBe(0);
                   this.scrollToBottom();
                   expect(this.content.scrollTop).toBe(this.content.scrollHeight - this.content.clientHeight);

                   done();
               }));

            it("scrollLeft/scrollToLeft/scrollToRight",
               (done) => sbRender(function () {
                   this.scrollLeft = 50;
                   expect(this.scrollLeft).toBe(50);
                   expect(this.content.scrollLeft).toBe(50);
                   this.scrollToLeft();
                   expect(this.content.scrollLeft).toBe(0);
                   this.scrollToRight();
                   expect(this.content.scrollLeft).toBe(this.content.scrollWidth - this.content.clientWidth);

                   done();
               }));

            it("scrollHeight should not be settable",
               (done) => sbRender(function () {
                   expect(() => {this.scrollHeight = 0;}).toThrow(TypeError);

                   done();
               }));

            it("scrollWidth should not be settable",
               (done) => sbRender(function () {
                   expect(() => {this.scrollWidth = 0;}).toThrow(TypeError);

                   done();
               }));

            it("clientHeight should not be settable",
               (done) => sbRender(function () {
                   expect(() => {this.clientHeight = 0;}).toThrow(TypeError);

                   done();
               }));

            it("clientWidth should not be settable",
               (done) => sbRender(function () {
                   expect(() => {this.clientWidth = 0;}).toThrow(TypeError);

                   done();
               }));
        });
    });
}
