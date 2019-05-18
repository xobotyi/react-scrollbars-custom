import * as React from "react";
import Scrollbar from "react-scrollbars-custom";

export const PARAGRAPHS_TEXT = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget venenatis arcu. Mauris in vestibulum velit. Suspendisse ac fermentum sapien. Aliquam accumsan vulputate tempus. Vestibulum sed dolor mollis, tristique nisl ac, volutpat sapien. Pellentesque eu enim ullamcorper, rhoncus urna id, sagittis tortor. Nulla venenatis congue dignissim. Phasellus ut ultricies sapien. Duis lacinia hendrerit leo et accumsan. Sed tincidunt augue et elit finibus suscipit. Duis rhoncus cursus leo, non aliquam lacus tempor id.",
  "Nullam scelerisque leo at lectus iaculis sodales. Mauris tempor scelerisque neque, quis efficitur enim bibendum in. Sed leo purus, elementum sit amet nulla vel, dignissim blandit purus. Proin leo risus, commodo eu efficitur vitae, tempus quis lorem. Etiam suscipit at ipsum et auctor. Suspendisse tempor dui non enim ultrices sodales et vitae tellus. Suspendisse at erat sit amet nisl tincidunt aliquet. Donec quis convallis ante, ac tristique ipsum. Duis a consequat quam. Nulla hendrerit semper lacus, efficitur laoreet nisl sollicitudin nec. Sed facilisis dui id sem iaculis pretium. Vestibulum aliquam mi lacinia sapien pulvinar, vel ullamcorper purus venenatis. Mauris congue in turpis non rhoncus. Vestibulum efficitur mauris a massa hendrerit, non viverra libero sagittis.",
  "Vestibulum tincidunt velit consectetur nisi condimentum, sed tempus sem facilisis. Nullam odio arcu, tincidunt ut lorem sit amet, tempus maximus velit. Donec nec nibh sodales nunc ullamcorper finibus non in massa. Suspendisse pulvinar ex auctor, volutpat massa et, mollis ante. Morbi sit amet dictum eros, sed dictum lacus. Vestibulum quis magna at metus placerat iaculis. Vestibulum posuere nisi felis, at fringilla leo vulputate quis. Cras et urna et erat tristique dictum. Morbi cursus lacus in mi ultrices, vitae tempor velit lacinia. Suspendisse id convallis lacus. Donec luctus, velit in tempus ornare, ipsum urna pellentesque turpis, fermentum facilisis quam risus eget tellus.",
  "In volutpat in lorem nec dignissim. Integer dictum ex eu orci cursus porttitor. Nulla a scelerisque leo. Mauris semper feugiat tellus, sodales semper neque gravida sit amet. Phasellus aliquet ipsum quis lacus pulvinar, pharetra egestas est viverra. Maecenas ac hendrerit neque. Vivamus non lacus et ex accumsan tristique ut vel felis. Curabitur et tincidunt massa, eget commodo justo.",
  "Suspendisse ipsum sapien, feugiat eget urna at, fringilla molestie elit. Fusce eu est nunc. Nullam interdum turpis purus, eu consequat lorem molestie cursus. Sed aliquam gravida diam fringilla accumsan. Proin ut massa est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris tincidunt enim ut augue congue, vitae mattis mauris laoreet. Phasellus id purus suscipit, dictum tortor in, fringilla sem. Praesent ullamcorper risus est, ac tempor lectus scelerisque a. Nullam dictum ipsum iaculis metus consectetur posuere. Nunc semper dolor convallis sapien cursus, sit amet tincidunt enim venenatis. Morbi vitae purus erat. Donec eget mi libero. Nullam sit amet diam purus. Sed in nisl varius, rutrum libero ac, sodales sem."
];

export function getRandomParagraphText() {
  return PARAGRAPHS_TEXT[Math.floor(Math.random() * PARAGRAPHS_TEXT.length)];
}

export function renderAmountOfParagraphs(amount = 5, paragrapsProps) {
  const result = [];

  for (; amount--; ) {
    result.push(
      <p {...paragrapsProps} className="ExampleCard-Paragraph" key={`paragraph_${amount}`}>
        {getRandomParagraphText()}
      </p>
    );
  }

  return result;
}

export default class DefaultExample extends React.Component {
  render() {
    return (
      <div className="ExampleCard">
        <div className="ExampleCard-Head">
          <div className="ExampleCard-Title">Default style</div>

          <div className="ExampleCard-Links" />
        </div>

        <div className="ExampleCard-Description">
          <p>
            These are the styles that come out of the box. No flexbox, no grid, no modern stuff that can break your
            browser support strategy.
          </p>
          <p>
            They're maid mostly for light style as most part of the web is light, but that's not a problem - you can
            style it however you want!
          </p>
        </div>

        <div className="ExampleCard-Separator">×</div>

        <div className="ExampleCard-Holder">
          <Scrollbar style={{ position: "" }}>{renderAmountOfParagraphs(10)}</Scrollbar>
        </div>
      </div>
    );
  }
}
