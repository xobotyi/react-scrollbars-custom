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
