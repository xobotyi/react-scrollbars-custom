/**
 * @description Return element's height without padding
 */
export const getInnerHeight = (el: HTMLElement): number => {
  const styles = getComputedStyle(el);

  return styles.boxSizing === "content-box"
    ? parseFloat(styles.height || <string>(<unknown>0))
    : Math.max(
        parseFloat(styles.height || <string>(<unknown>0)) -
          parseFloat(styles.paddingBottom || <string>(<unknown>0)) -
          parseFloat(styles.paddingTop || <string>(<unknown>0)),
        0
      );
};

/**
 * @description Return element's width without padding
 */
export const getInnerWidth = (el: HTMLElement): number => {
  const styles = getComputedStyle(el);

  return styles.boxSizing === "content-box"
    ? parseFloat(styles.width || <string>(<unknown>0))
    : Math.max(
        parseFloat(styles.width || <string>(<unknown>0)) -
          parseFloat(styles.paddingRight || <string>(<unknown>0)) -
          parseFloat(styles.paddingLeft || <string>(<unknown>0)),
        0
      );
};

/**
 * @description Return element's dimensions without padding
 */
export const getInnerDimensions = (
  el: HTMLElement
): { width: number; height: number } => {
  let styles = getComputedStyle(el);

  return styles.boxSizing === "content-box"
    ? {
        height: parseFloat(styles.height || <string>(<unknown>0)),
        width: parseFloat(styles.width || <string>(<unknown>0))
      }
    : {
        height: Math.max(
          parseFloat(styles.height || <string>(<unknown>0)) -
            parseFloat(styles.paddingBottom || <string>(<unknown>0)) -
            parseFloat(styles.paddingTop || <string>(<unknown>0)),
          0
        ),
        width: Math.max(
          parseFloat(styles.width || <string>(<unknown>0)) -
            parseFloat(styles.paddingRight || <string>(<unknown>0)) -
            parseFloat(styles.paddingLeft || <string>(<unknown>0)),
          0
        )
      };
};
