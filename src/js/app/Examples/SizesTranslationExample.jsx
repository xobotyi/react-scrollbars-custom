import { faCode } from "@fortawesome/free-solid-svg-icons/faCode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import Scrollbar from "react-scrollbars-custom";
import { renderAmountOfParagraphs } from "./DefaultExample";

export default class SizesTranslationExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      paragraphProps: { style: { minWidth: "70rem", width: "120rem" } },
      paragraphsCount: 2
    };

    let i = 0;

    this.interval = setInterval(() => {
      i++;

      switch (i % 5) {
        case 0:
          return this.setState({
            paragraphProps: { style: { minWidth: "70rem", width: "70rem" } }
          });

        case 1:
          return this.setState({
            paragraphsCount: 3,
            paragraphProps: { style: { minWidth: "70rem", width: "120rem" } }
          });

        case 2:
          return this.setState({
            paragraphsCount: 5,
            paragraphProps: { style: { minWidth: "70rem", width: "190rem" } }
          });

        case 3:
          return this.setState({
            paragraphsCount: 10,
            paragraphProps: { style: { minWidth: "70rem", width: "80rem" } }
          });

        case 4:
          return this.setState({
            paragraphsCount: 3,
            paragraphProps: { style: { minWidth: "70rem", width: "210rem" } }
          });
      }
    }, 1500);
  }

  render() {
    return (
      <div className="ExampleCard SizesTranslation">
        <div className="ExampleCard-Head">
          <div className="ExampleCard-Title">Sizes translation</div>

          <div className="ExampleCard-Links">
            <a
              href="https://github.com/xobotyi/react-scrollbars-custom/blob/gh-pages/src/js/app/Examples/SizesTranslationExample.jsx"
              className="ExampleCard-SourceLink"
              target="_blank"
            >
              <FontAwesomeIcon icon={faCode} />
              <span>View source</span>
            </a>
          </div>
        </div>

        <div className="ExampleCard-Description">
          <p>And finally here you can see one of "killer-feature" i would say.</p>
          <p>
            The content changes dynamically, both vertically and horizontally, wrapper the content's sizes and only when
            it reaches maximal size - the scrollbars appear.
          </p>
          <p>
            Note that wrapper does not has any hardly programmed sizes - only <code>max-height</code> and{" "}
            <code>max-width</code>, the only thing that changes - inner content.
          </p>
        </div>

        <div className="ExampleCard-Separator">×</div>

        <div className="ExampleCard-Holder">
          <Scrollbar noDefaultStyles translateContentSizesToHolder compensateScrollbarsWidth={false}>
            {renderAmountOfParagraphs(this.state.paragraphsCount, this.state.paragraphProps)}
          </Scrollbar>
        </div>
      </div>
    );
  }
}
