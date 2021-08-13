import * as React from "react";

export const style = {
  holder: {
    position: "relative",
    width: "100%",
    height: "100%",
  } as React.CSSProperties,

  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  } as React.CSSProperties,

  content: {
    boxSizing: "border-box",
  } as React.CSSProperties,

  track: {
    common: {
      position: "absolute",
      overflow: "hidden",
      borderRadius: 4,
      background: "rgba(0,0,0,.1)",
      userSelect: "none",
    } as React.CSSProperties,
    x: {
      height: 10,
      width: "calc(100% - 20px)",
      bottom: 0,
      left: 10,
    } as React.CSSProperties,
    y: {
      width: 10,
      height: "calc(100% - 20px)",
      top: 10,
    } as React.CSSProperties,
  },

  thumb: {
    common: {
      cursor: "pointer",
      borderRadius: 4,
      background: "rgba(0,0,0,.4)",
    } as React.CSSProperties,
    x: {
      height: "100%",
      width: 0,
    } as React.CSSProperties,
    y: {
      width: "100%",
      height: 0,
    } as React.CSSProperties,
  },
};

export default style;
