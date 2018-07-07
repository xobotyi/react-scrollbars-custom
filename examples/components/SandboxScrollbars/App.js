import React     from 'react';
import Scrollbar from 'react-scrollbars-custom';

export default class App extends React.Component
{
    constructor(props, ...rest) {
        super(props, ...rest);

        this.handleTracksClick = this.handleTracksClick.bind(this);
        this.handleRandomScrollPositionClick = this.handleRandomScrollPositionClick.bind(this);
        this.handleAddParagraphClick = this.handleAddParagraphClick.bind(this);
        this.handleNoScrollClick = this.handleNoScrollClick.bind(this);
        this.handleNoScrollXClick = this.handleNoScrollXClick.bind(this);
        this.handleNoScrollYClick = this.handleNoScrollYClick.bind(this);

        this.state = {
            permanentTracks: false,
            noScroll:        false,
            noScrollX:       false,
            noScrollY:       false,
            paragraphs:      3,
        };
    }

    handleTracksClick() {
        this.setState({
                          ...this.state,
                          permanentTracks: !this.state.permanentTracks,
                      });
    }

    handleNoScrollClick() {
        this.setState({
                          ...this.state,
                          noScroll: !this.state.noScroll,
                      });
    }

    handleNoScrollXClick() {
        this.setState({
                          ...this.state,
                          noScrollX: !this.state.noScrollX,
                      });
    }

    handleNoScrollYClick() {
        this.setState({
                          ...this.state,
                          noScrollY: !this.state.noScrollY,
                      });
    }

    handleAddParagraphClick() {
        this.setState({
                          ...this.state,
                          paragraphs: this.state.paragraphs + 1,
                      });
    }

    handleRandomScrollPositionClick() {
        this.scrollbar.scrollTop = Math.floor(Math.random() * (this.scrollbar.scrollHeight + 1));
    }

    render() {
        const {permanentTracks, paragraphs, noScroll, noScrollX, noScrollY} = this.state;
        const elements = [...Array(paragraphs)].map((v, i) =>
                                                            <p key={ i }>Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat, facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>);

        return (
                <div className="scroller" id="sandboxScrollbarsRoot">
                    <div className="title">Sandbox</div>
                    <div className="description">
                        <div className="button" onClick={ this.handleTracksClick }>{ permanentTracks ? "Dont show" : "Show" } tracks permanently</div>
                        <div className="button" onClick={ this.handleNoScrollClick }>{ noScroll ? "Scroll" : "No scroll" }</div>
                        <div className="button" onClick={ this.handleNoScrollXClick }>{ noScrollX ? "Scroll X" : "No scroll X" }</div>
                        <div className="button" onClick={ this.handleNoScrollYClick }>{ noScrollY ? "Scroll Y" : "No scroll Y" }</div>
                        <div className="button" onClick={ this.handleRandomScrollPositionClick }>Random position</div>
                        <div className="button" onClick={ this.handleAddParagraphClick }>Add paragraph</div>
                    </div>
                    <Scrollbar
                            ref={ (ref) => {this.scrollbar = ref;} }
                            defaultStyles={ false }
                            noScroll={ noScroll }
                            scrollX={ !noScrollX }
                            scrollY={ !noScrollY }
                            permanentScrollbars={ permanentTracks }>
                        { elements }
                    </Scrollbar>
                </div>
        );
    }
}
