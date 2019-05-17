import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

export default class AppHeader extends React.Component {
  render() {
    return (
      <div id="App-Header">
        <div className="left">
          <div className="App-PackageName">{RSC_NAME}</div>
          <div className="App-PackageVersion">v{RSC_VERSION}</div>
        </div>

        <div className="right">
          <a
            className="App-PackageRepoLink"
            href="https://github.com/xobotyi/react-scrollbars-custom"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
      </div>
    );
  }
}
