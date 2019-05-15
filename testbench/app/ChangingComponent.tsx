import * as React from "react";

const text =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a ligula risus. Sed quis ex ac nisl egestas tempus. Morbi viverra orci dignissim risus condimentum iaculis. Nunc quis metus sed purus tempus interdum. Vivamus lectus neque, congue sit amet turpis at, consequat auctor odio. Maecenas nec rhoncus est. Aliquam eu urna vel sem auctor volutpat at eu enim.";

export default class ChangingComponent extends React.Component<{}, { count: number }> {
  interval: number;

  constructor(props) {
    super(props);

    this.state = {
      count: 2
    };
  }

  componentDidMount(): void {
    this.interval = window.setInterval(() => {
      this.setState({
        count: this.state.count + (this.state.count === 5 ? -1 : 1)
      });
    }, 2000);
  }

  componentWillUnmount(): void {
    window.clearInterval(this.interval);
  }

  public render(): React.ReactNode {
    const paragraphs: React.ReactNode[] = [];

    for (let i = 0; i < this.state.count; i++) {
      paragraphs.push(
        <p key={i} style={{ padding: "4px 10px 4px 4px" }}>
          {text}
        </p>
      );
    }

    return <div>{paragraphs}</div>;
  }
}
