import React, { HTMLProps, MutableRefObject } from 'react';
import { AXIS } from './util';

export interface TrackProps extends HTMLProps<HTMLDivElement> {
  axis: AXIS;

  elementRef?: MutableRefObject<HTMLDivElement>;
}

export const Track: React.FC<TrackProps> = ({ elementRef, ...props }) => (
  <div ref={elementRef} {...props} />
);

Track.displayName = 'Track';
