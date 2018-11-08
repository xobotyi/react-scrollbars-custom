import React from "react";
import Scrollbar from "react-scrollbars-custom";

const paragraphText =
    "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat, facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.";

export default class AutohideTracksBlock extends React.Component {
    constructor(props) {
        super(props);

        this.handleScrollStart = this.handleScrollStart.bind(this);
        this.handleScrollStop = this.handleScrollStop.bind(this);
        this.handleThumbMouseover = this.handleThumbMouseover.bind(this);
        this.handleThumbMouseout = this.handleThumbMouseout.bind(this);
    }

    getParagraphs(count) {
        return [...Array(count)].map((v, i) => <p key={i}>{paragraphText}</p>);
    }

    componentDidMount() {
        this.scrollbar.trackVertical.addEventListener("mouseover", this.handleThumbMouseover);
        this.scrollbar.trackVertical.addEventListener("mouseout", this.handleThumbMouseout);
    }

    componentWillUnmount() {
        this.scrollbar.trackVertical.removeEventListener("mouseover", this.handleThumbMouseover);
        this.scrollbar.trackVertical.removeEventListener("mouseout", this.handleThumbMouseout);
    }

    handleThumbMouseover() {
        this.scrollbar.trackVertical.style.opacity = 1;
    }

    handleThumbMouseout() {
        if (!this.scrollbar.thumbVertical.classList.contains("dragging")) {
            this.scrollbar.trackVertical.style.opacity = 0;
        }
    }

    handleScrollStart(scrollbar) {
        this.scrollbar.trackVertical.style.opacity = 1;
    }

    handleScrollStop(scrollbar) {
        this.scrollbar.trackVertical.style.opacity = 0;
    }

    render() {
        return (
            <div className="block" id="AutohideTracksBlock">
                <div className="title">Tracks autohide</div>
                <div className="description">
                    Here we can see mobile-like behaviour, when scrollbars are hidden when scroll is not performed.
                    <br />
                    It is implemented with help of <code>onScrollStart</code> and <code>onScrollStop</code> callbacks.
                </div>
                <div className="content" style={{height: 280}}>
                    <Scrollbar
                        trackVerticalStyle={{opacity: 0}}
                        ref={ref => {
                            this.scrollbar = ref;
                        }}
                        onScrollStart={this.handleScrollStart}
                        onScrollStop={this.handleScrollStop}
                        scrollDetectionThreshold={500}>
                        {this.getParagraphs(15)}
                    </Scrollbar>
                </div>
            </div>
        );
    }
}
