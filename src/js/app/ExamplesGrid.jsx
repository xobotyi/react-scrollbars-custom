import * as React from "react";
import CustomStyledExample from "./Examples/CustomStyledExample";
import DefaultExample from "./Examples/DefaultExample";

export default class ExamplesGrid extends React.Component {
  render() {
    return (
      <div id="ExamplesGrid">
        <div className="ExamplesGrid-Row">
          <DefaultExample />

          <CustomStyledExample />
        </div>
      </div>
    );
  }
}
