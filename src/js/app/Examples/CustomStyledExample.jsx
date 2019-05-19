import { faCode } from "@fortawesome/free-solid-svg-icons/faCode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import Scrollbar from "react-scrollbars-custom";
import { renderAmountOfParagraphs } from "./DefaultExample";

export default class CustomStyledExample extends React.Component {
  render() {
    return (
      <div className="ExampleCard CustomStyled">
        <div className="ExampleCard-Head">
          <div className="ExampleCard-Title">Custom style</div>

          <div className="ExampleCard-Links">
            <a
              href="https://github.com/xobotyi/react-scrollbars-custom/blob/gh-pages/src/js/app/Examples/CustomStyledExample.jsx"
              className="ExampleCard-SourceLink"
              target="_blank"
            >
              <FontAwesomeIcon icon={faCode} />
              <span>View source</span>
            </a>
          </div>
        </div>

        <div className="ExampleCard-Description">
          <p>Now lets style our scrollbars a bit to more or less fit the appearance of this page.</p>
          <p>
            Vertical scrollbar will be outside the content and bottom one will overlay it. I'll make the styling via CSS
            with disabled default styles.
          </p>
        </div>

        <div className="ExampleCard-Separator">×</div>

        <div className="ExampleCard-Holder">
          <Scrollbar noDefaultStyles compensateScrollbarsWidth={false} style={{ position: "" }}>
            {renderAmountOfParagraphs(20)}
          </Scrollbar>
        </div>
      </div>
    );
  }
}
