import React, { HTMLProps } from 'react';
import { Thumb } from './Thumb';
import { AXIS } from './util';
import { Track } from './Track';

export type ScrollbarProps = HTMLProps<HTMLDivElement>;

export const Scrollbar: React.FC<ScrollbarProps> = ({ children, ...props }) => (
  <div {...props}>
    <div>
      <div>{children}</div>
    </div>

    <Track axis={AXIS.Y}>
      <Thumb axis={AXIS.Y} />
    </Track>

    <Track axis={AXIS.X}>
      <Thumb axis={AXIS.X} />
    </Track>
  </div>
);

Scrollbar.displayName = 'Scrollbar';
