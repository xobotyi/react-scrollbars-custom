import * as React from "react";

export default class AppFooter extends React.Component {
  render() {
    console.log(RSC_HOMEPAGE, RSC_NAME, RSC_AUTHOR);

    return (
      <div id="App-Footer">
        <div className="links">
          <a href={RSC_HOMEPAGE}>{RSC_NAME}</a>×
          <a href={RSC_AUTHOR.url}>{RSC_AUTHOR.name}</a>
        </div>
      </div>
    );
  }
}
