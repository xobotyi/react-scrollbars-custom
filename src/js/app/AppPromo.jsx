import * as React from "react";

export default class AppPromo extends React.Component {
  render() {
    return (
      <div id="App-Promo">
        <div className="App-About">
          <div className="About-Title">About</div>
          <p>
            Have you ever had to make a dark styled site? If yes - you should know that awful moment when browser's
            light-gray scrollbars appear on your dark website.
          </p>
          <p>
            It would not be a big deal if you're targeted at chromium-based browser which allows you to style the
            scrollbars, but there are lots of other browsers that does not have that feature and i'm not even telling
            about legacy ones and mobile devices.
          </p>
          <p>
            RSC is a crossbrowser React component that allow you easily customize the look and feel of your site
            scrollbars. No matter what platform you targeted - now you are in control of scrollbars.
          </p>

          <div className="links">
            ×
            <a className="link" href="https://github.com/xobotyi/react-scrollbars-custom#usage">
              DOCS
            </a>
            ×
            <a className="link" href="https://codesandbox.io/s/rsc-live-example-i1zlx?module=%2Fsrc%2FRSCExample.jsx">
              LIVE EXAMPLE
            </a>
            ×
          </div>
        </div>

        <div className="App-FeatureList">
          <div className="FeatureList-Title">RSC Features</div>

          <div className="FeatureList-Item">
            Native browser scroll behavior - it don't emulate scrolling, only showing custom scrollbars, scrolling
            itself still native;
          </div>

          <div className="FeatureList-Item">
            Cross-browser and cross-platform - does not matter where and how, scrollbars looks the same everywhere;
          </div>

          <div className="FeatureList-Item">Ultimate performance - 60 FPS (using RAF) and highly optimised code;</div>

          <div className="FeatureList-Item">
            No extra stylesheets required - minimum inline styles out of the box or you can style it yourself however
            you want
          </div>

          <div className="FeatureList-Item">
            Fully customizable - want a hippo as a scrollbar thumb? Well.. I don't judge you, you're free to do it!
          </div>

          <div className="FeatureList-Item">
            Scrollbars nesting and accessibility from children components through context
          </div>

          <div className="FeatureList-Item">Total tests coverage</div>

          <div className="FeatureList-Item">Momentum scrolling for iOS</div>

          <div className="FeatureList-Item">
            RTL support [
            <a className="link" href="https://github.com/xobotyi/react-scrollbars-custom#rtl-support">
              read more
            </a>
            ]
          </div>

          <div className="FeatureList-Item">
            Content sizes translation [
            <a className="link" href="https://github.com/xobotyi/react-scrollbars-custom#content-sizes-translation">
              read more
            </a>
            ]
          </div>
        </div>
      </div>
    );
  }
}
