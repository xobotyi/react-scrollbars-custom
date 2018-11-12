import React from "react";

export default class Head extends React.Component {
  render() {
    return (
      <div id="AppHead">
        <h1>{this.props.packageName}</h1>
        <a href={this.props.packageLink} className="ghLink">
          <i className="fa fa-github" />
        </a>
      </div>
    );
  }
}
