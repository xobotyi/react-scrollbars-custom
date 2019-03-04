/**
 * @description Return element's height without padding
 */
export const getInnerHeight = (el: HTMLElement): number => {
  const styles = getComputedStyle(el);
  const height =
    styles.height && styles.height !== "auto" ? styles.height : "0";

  return styles.boxSizing === "border-box"
    ? Math.max(
        parseFloat(height) -
          parseFloat(styles.paddingBottom || "0") -
          parseFloat(styles.paddingTop || "0"),
        0
      )
    : parseFloat(height);
};

/**
 * @description Return element's width without padding
 */
export const getInnerWidth = (el: HTMLElement): number => {
  const styles = getComputedStyle(el);
  const width = styles.width && styles.width !== "auto" ? styles.width : "0";

  return styles.boxSizing === "border-box"
    ? Math.max(
        parseFloat(width) -
          parseFloat(styles.paddingRight || "0") -
          parseFloat(styles.paddingLeft || "0"),
        0
      )
    : parseFloat(width);
};

/**
 * @description Return element's dimensions without padding
 */
export const getInnerDimensions = (
  el: HTMLElement
): { width: number; height: number } => {
  let styles = getComputedStyle(el);

  const width = styles.width && styles.width !== "auto" ? styles.width : "0";
  const height =
    styles.height && styles.height !== "auto" ? styles.height : "0";

  return styles.boxSizing === "border-box"
    ? {
        height: Math.max(
          parseFloat(height) -
            parseFloat(styles.paddingBottom || "0") -
            parseFloat(styles.paddingTop || "0"),
          0
        ),
        width: Math.max(
          parseFloat(width) -
            parseFloat(styles.paddingRight || "0") -
            parseFloat(styles.paddingLeft || "0"),
          0
        )
      }
    : {
        height: parseFloat(height),
        width: parseFloat(width)
      };
};

/**
 * @description Return unique UUID v4
 */
export const uuid = () => {
  let uuid = "";

  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 20) {
      uuid += "-" + ((Math.random() * 16) | 0).toString(16);
    } else if (i === 12) {
      uuid += "-4";
    } else if (i === 16) {
      uuid += "-" + ((Math.random() * 16) | (0 & 3) | 8).toString(16);
    } else {
      uuid += ((Math.random() * 16) | 0).toString(16);
    }
  }

  return uuid;
};

/**
 * @description Calculate thumb size for given viewport and track parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} minimalSize - Minimal thumb's size
 * @param {number} maximalSize - Maximal thumb's size
 */
export function calcThumbSize(
  contentSize: number,
  viewportSize: number,
  trackSize: number,
  minimalSize?: number,
  maximalSize?: number
): number {
  if (viewportSize >= contentSize) {
    return 0;
  }

  let thumbSize = (viewportSize / contentSize) * trackSize;

  if (typeof maximalSize === "number") {
    thumbSize = Math.min(maximalSize, thumbSize);
  }
  if (typeof minimalSize === "number") {
    thumbSize = Math.max(minimalSize, thumbSize);
  }

  return thumbSize;
}

/**
 * @description Calculate thumb offset for given viewport, track and thumb parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} thumbSize - Thumb size
 * @param {number} scroll - Scroll value to represent
 */
export function calcThumbOffset(
  contentSize: number,
  viewportSize: number,
  trackSize: number,
  thumbSize: number,
  scroll: number
): number {
  if (!scroll || !thumbSize || viewportSize >= contentSize) {
    return 0;
  }

  return ((trackSize - thumbSize) * scroll) / (contentSize - viewportSize);
}

/**
 * @description Calculate scroll for given viewport, track and thumb parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} thumbSize - Thumb size
 * @param {number} thumbOffset - Thumb's offset representing the scroll
 */
export function calcScrollForThumbOffset(
  contentSize: number,
  viewportSize: number,
  trackSize: number,
  thumbSize: number,
  thumbOffset: number
): number {
  if (!thumbOffset || !thumbSize || viewportSize >= contentSize) {
    return 0;
  }

  return (thumbOffset * (contentSize - viewportSize)) / (trackSize - thumbSize);
}
