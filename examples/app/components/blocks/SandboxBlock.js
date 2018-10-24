import React from "react";
import Scrollbar from "react-scrollbars-custom";

const paragraphText =
    "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat, facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.";

export default class SandboxBlock extends React.Component {
    constructor(props) {
        super(props);

        this.toggleNoScroll = this.toggleNoScroll.bind(this);
        this.toggleNoScrollY = this.toggleNoScrollY.bind(this);
        this.toggleNoScrollX = this.toggleNoScrollX.bind(this);
        this.togglePermanentTracks = this.togglePermanentTracks.bind(this);
        this.togglePermanentTrackY = this.togglePermanentTrackY.bind(this);
        this.togglePermanentTrackX = this.togglePermanentTrackX.bind(this);
        this.handleAddParagraphClick = this.handleAddParagraphClick.bind(this);
        this.handleRemoveParagraphClick = this.handleRemoveParagraphClick.bind(
            this,
        );
        this.handleRandomPositionClick = this.handleRandomPositionClick.bind(
            this,
        );
        this.handleScrollTopClick = this.handleScrollTopClick.bind(this);
        this.handleScrollBottomClick = this.handleScrollBottomClick.bind(this);
        this.handleScrollLeftClick = this.handleScrollLeftClick.bind(this);
        this.handleScrollRightClick = this.handleScrollRightClick.bind(this);
        this.toggleRtl = this.toggleRtl.bind(this);

        this.state = {
            noScroll: false,
            noScrollY: false,
            noScrollX: false,

            rtl: false,

            permanentTracks: false,
            permanentTrackY: false,
            permanentTrackX: false,
            paragraphsCount: 5,
        };
    }

    getParagraphs(count) {
        return [...Array(count)].map((v, i) => <p key={i}>{paragraphText}</p>);
    }

    toggleNoScroll() {
        this.setState({
            ...this.state,
            noScroll: !this.state.noScroll,
            noScrollY: !this.state.noScroll,
            noScrollX: !this.state.noScroll,
        });
    }

    toggleNoScrollY() {
        this.setState({
            ...this.state,
            noScroll:
                (this.state.noScroll ? true : this.state.noScrollX) &&
                !this.state.noScrollY,
            noScrollY: !this.state.noScrollY,
            noScrollX: this.state.noScroll ? true : this.state.noScrollX,
        });
    }

    toggleNoScrollX() {
        this.setState({
            ...this.state,
            noScroll:
                !this.state.noScrollX &&
                (this.state.noScroll ? true : this.state.noScrollY),
            noScrollX: !this.state.noScrollX,
            noScrollY: this.state.noScroll ? true : this.state.noScrollY,
        });
    }

    togglePermanentTracks() {
        this.setState({
            ...this.state,
            permanentTracks: !this.state.permanentTracks,
            permanentTrackY: !this.state.permanentTracks,
            permanentTrackX: !this.state.permanentTracks,
        });
    }

    togglePermanentTrackY() {
        this.setState({
            ...this.state,
            permanentTracks:
                (this.state.permanentTracks
                    ? true
                    : this.state.permanentTrackX) &&
                !this.state.permanentTrackY,
            permanentTrackY: !this.state.permanentTrackY,
            permanentTrackX: this.state.permanentTracks
                ? true
                : this.state.permanentTrackX,
        });
    }

    togglePermanentTrackX() {
        this.setState({
            ...this.state,
            permanentTracks:
                !this.state.permanentTrackX &&
                (this.state.permanentTracks
                    ? true
                    : this.state.permanentTrackY),
            permanentTrackX: !this.state.permanentTrackX,
            permanentTrackY: this.state.permanentTracks
                ? true
                : this.state.permanentTrackY,
        });
    }

    toggleRtl() {
        this.setState({
            ...this.state,
            rtl: !this.state.rtl,
        });
    }

    handleAddParagraphClick() {
        this.setState({
            ...this.state,
            paragraphsCount: this.state.paragraphsCount + 1,
        });
    }

    handleRemoveParagraphClick() {
        this.setState({
            ...this.state,
            paragraphsCount: Math.max(0, this.state.paragraphsCount - 1),
        });
    }

    handleRandomPositionClick() {
        this.scrollbar.scrollTop = Math.floor(
            Math.random() * (this.scrollbar.scrollHeight + 1),
        );
        this.scrollbar.scrollLeft = Math.floor(
            Math.random() * (this.scrollbar.scrollWidth + 1),
        );
    }

    handleScrollTopClick() {
        this.scrollbar.scrollToTop();
    }

    handleScrollBottomClick() {
        this.scrollbar.scrollToBottom();
    }

    handleScrollLeftClick() {
        this.scrollbar.scrollToLeft();
    }

    handleScrollRightClick() {
        this.scrollbar.scrollToRight();
    }

    render() {
        const {
            noScroll,
            noScrollY,
            noScrollX,
            permanentTracks,
            permanentTrackY,
            permanentTrackX,
            rtl,
        } = this.state;

        return (
            <div className="block" id="SandboxBlock">
                <div className="title">Sandbox</div>
                <div className="description">
                    <div
                        className="button"
                        key="noScroll"
                        onClick={this.toggleNoScroll}
                    >
                        {noScroll ? "Enable scroll" : "Disable scroll"}
                    </div>
                    <div
                        className="button"
                        key="noScrollY"
                        onClick={this.toggleNoScrollY}
                    >
                        {noScrollY || noScroll
                            ? "Enable scroll Y"
                            : "Disable scroll Y"}
                    </div>
                    <div
                        className="button"
                        key="noScrollX"
                        onClick={this.toggleNoScrollX}
                    >
                        {noScrollX || noScroll
                            ? "Enable scroll X"
                            : "Disable scroll X"}
                    </div>
                    <br />
                    <div
                        className="button"
                        key="permanentTracks"
                        onClick={this.togglePermanentTracks}
                    >
                        {permanentTracks
                            ? "Show tracks if needed"
                            : "Always show tracks"}
                    </div>
                    <div
                        className="button"
                        key="permanentTracksY"
                        onClick={this.togglePermanentTrackY}
                    >
                        {permanentTrackY || permanentTracks
                            ? "Show track Y if needed"
                            : "Always show track Y"}
                    </div>
                    <div
                        className="button"
                        key="permanentTracksX"
                        onClick={this.togglePermanentTrackX}
                    >
                        {permanentTrackX || permanentTracks
                            ? "Show track X if needed"
                            : "Always show track X"}
                    </div>
                    <div
                        className="button"
                        key="direction"
                        onClick={this.toggleRtl}
                    >
                        {rtl ? "set direction LRT" : "set direction RTL"}
                    </div>
                    <br />
                    <div
                        className="button"
                        key="randomPosition"
                        onClick={this.handleRandomPositionClick}
                    >
                        Random position
                    </div>
                    <div
                        className="button"
                        key="scrollTop"
                        onClick={this.handleScrollTopClick}
                    >
                        Scroll top
                    </div>
                    <div
                        className="button"
                        key="scrollBottom"
                        onClick={this.handleScrollBottomClick}
                    >
                        Scroll bottom
                    </div>
                    <div
                        className="button"
                        key="scrollLeft"
                        onClick={this.handleScrollLeftClick}
                    >
                        Scroll left
                    </div>
                    <div
                        className="button"
                        key="scrollRight"
                        onClick={this.handleScrollRightClick}
                    >
                        Scroll right
                    </div>
                    <br />
                    <div
                        className="button"
                        key="addParagraph"
                        onClick={this.handleAddParagraphClick}
                    >
                        Add paragraph
                    </div>
                    {!!this.state.paragraphsCount && (
                        <div
                            className="button"
                            key="removeParagraph"
                            onClick={this.handleRemoveParagraphClick}
                        >
                            Remove paragraph
                        </div>
                    )}
                </div>
                <div className="content" style={{ height: 280 }}>
                    <Scrollbar
                        defaultStyles={false}
                        ref={(ref) => {
                            this.scrollbar = ref;
                        }}
                        noScroll={noScroll}
                        noScrollY={noScrollY}
                        noScrollX={noScrollX}
                        rtl={rtl}
                        permanentScrollbars={permanentTracks}
                        permanentScrollbarY={permanentTrackY}
                        permanentScrollbarX={permanentTrackX}
                    >
                        {this.getParagraphs(this.state.paragraphsCount)}
                    </Scrollbar>
                </div>
            </div>
        );
    }
}
