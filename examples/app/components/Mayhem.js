import React from "react";
import Scrollbar from "react-scrollbars-custom";

const paragraphText =
    "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat, facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.";

export default class Mayhem extends React.Component {
    constructor(props) {
        super(props);

        this.state = { scrollbarsCount: 28 };

        this.incrementScrollbars = this.incrementScrollbars.bind(this);
        this.decrementScrollbars = this.decrementScrollbars.bind(this);
    }

    drawScrollbars(count) {
        return [...Array(count)].map((v, i) => {
            let scrollbar;
            return (
                <Scrollbar
                    key={i}
                    style={{ width: 150, height: 150, margin: "1rem" }}
                    ref={ref => {
                        scrollbar = ref;
                    }}
                >
                    <p style={{ width: "200%" }}>{paragraphText}</p>
                </Scrollbar>
            );
        });
    }

    incrementScrollbars() {
        this.setState({
            ...this.state,
            scrollbarsCount: this.state.scrollbarsCount + 1,
        });
    }

    decrementScrollbars() {
        this.setState({
            ...this.state,
            scrollbarsCount: Math.max(this.state.scrollbarsCount - 1, 0),
        });
    }

    render() {
        const { scrollbarsCount } = this.state;

        return (
            <div id="AppBody">
                <div className="packageDescription">
                    Scrollbars rendered: {scrollbarsCount}
                    <br />
                    <span
                        className="button"
                        key="plus"
                        onClick={this.incrementScrollbars}
                    >
                        increase
                    </span>
                    <span
                        className="button"
                        key="minus"
                        onClick={this.decrementScrollbars}
                    >
                        decrease
                    </span>
                </div>
                <div className="mayhemScrollbarsHolder">
                    {this.drawScrollbars(scrollbarsCount)}
                </div>
            </div>
        );
    }
}
