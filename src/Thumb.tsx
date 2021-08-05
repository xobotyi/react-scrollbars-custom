import React, { HTMLProps, MutableRefObject } from 'react';
import { AXIS } from './util';

export interface ThumbProps extends HTMLProps<HTMLDivElement> {
  axis: AXIS;

  elementRef?: MutableRefObject<HTMLDivElement>;
}

export const Thumb: React.FC<ThumbProps> = ({ elementRef, ...props }) => (
  <div ref={elementRef} {...props} />
);

Thumb.displayName = 'Thumb';
