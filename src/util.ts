/**
 * @description Return element's height without padding
 */
export const getInnerHeight = (el: HTMLElement): number => {
    const styles = getComputedStyle(el);
    const paddingTop = styles.paddingTop ? styles.paddingTop.slice(0, -2) : 0;
    const paddingBottom = styles.paddingBottom ? styles.paddingBottom.slice(0, -2) : 0;

    return el.clientHeight - <number>paddingTop - <number>paddingBottom;
};

/**
 * @description Return element's width without padding
 */
export const getInnerWidth = (el: HTMLElement): number => {
    let styles = getComputedStyle(el);
    const paddingLeft = styles.paddingLeft ? styles.paddingLeft.slice(0, -2) : 0;
    const paddingRight = styles.paddingRight ? styles.paddingRight.slice(0, -2) : 0;

    return el.clientWidth - <number>paddingLeft - <number>paddingRight;
};

interface elementInnerSizes {
    width: number;
    height: number;
}

/**
 * @description Return element's dimensions without padding
 */
export const util = (el: HTMLElement): elementInnerSizes => {
    let styles = getComputedStyle(el);
    const paddingTop = styles.paddingTop ? styles.paddingTop.slice(0, -2) : 0;
    const paddingBottom = styles.paddingBottom ? styles.paddingBottom.slice(0, -2) : 0;
    const paddingLeft = styles.paddingLeft ? styles.paddingLeft.slice(0, -2) : 0;
    const paddingRight = styles.paddingRight ? styles.paddingRight.slice(0, -2) : 0;

    return {
        width: el.clientWidth - <number>paddingLeft - <number>paddingRight,
        height: el.clientHeight - <number>paddingTop - <number>paddingBottom,
    };
};
