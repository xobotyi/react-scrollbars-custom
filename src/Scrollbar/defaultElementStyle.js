export const holder = {
    display:             "grid",
    position:            "relative",
    gridTemplateColumns: "1fr min-content",
    gridTemplateRows:    "1fr min-content",
};
export const wrapper = {
    gridColumn: 1,
    gridRow:    1,
};
export const trackVertical = {
    position:   "relative",
    width:      8,
    background: "rgba(0,0,0,.1)",
    gridColumn: 2,
    gridRow:    1,
};
export const trackHorizontal = {
    position:   "relative",
    height:     8,
    background: "rgba(0,0,0,.1)",
    gridColumn: 1,
    gridRow:    2,
};
export const thumbVertical = {
    position:   "relative",
    width:      "100%",
    height:     0,
    cursor:     "pointer",
    background: "rgba(0,0,0,.35)",
};
export const thumbHorizontal = {
    position:   "relative",
    height:     "100%",
    width:      0,
    cursor:     "pointer",
    background: "rgba(0,0,0,.35)",
};
export const content = {
    position: "absolute",
    top:      0,
    bottom:   0,
    left:     0,
    right:    0,
    overflow: "scroll",
};

export const holderGridless = {
    position: "relative",
};
export const wrapperGridless = {
    minHeight: "100%",
};
export const trackVerticalGridless = {
    background: "rgba(0,0,0,.1)",
    position:   "absolute",
    width:      8,
    height:     "100%",
    right:      0,
    top:        0,
};
export const trackHorizontalGridless = {
    background: "rgba(0,0,0,.1)",
    position:   "absolute",
    height:     8,
    width:      "100%",
    left:       0,
    bottom:     0,
};
