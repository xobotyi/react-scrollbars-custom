import React from "react";

export default class Footer extends React.Component {
  render() {
    return (
      <div id="AppFooter">
        <a href={this.props.packageLink} className="projectLink">
          {this.props.packageName}
        </a>
        <a href={this.props.authorLink} className="authorLink">
          {this.props.authorName}
        </a>
      </div>
    );
  }
}
