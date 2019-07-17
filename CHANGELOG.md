# CHANGELOG

## v4.0.16

- Small code refactoring;
- Possible fix of #89;
- Fix of #57;

## v4.0.15

- Fixed cjs and esm builds;

## v4.0.14

- Improved typings of getInner\* functions (no more @ts-ignore);
- The proper scrollbar width detection now it is float number so no more 1px scrollbar showing off (Complete fix: #57);
- Improved testbench;

## v4.0.13

- Fix: #98;
- Improved props typings;

## v4.0.12

- Reverted the dist ESM filenames from `.mjs` to `.esm.js` due to lack of functionality of node modules system.

## v4.0.11

- A bit tweaked distribution strategy:
  - `main` field of `package.json` is pointing to transpiled ES3-compatible version with CJS modules resolution;
  - `module` field is pointing to transpiled ES3-compatible version with ES modules resolution;
  - `esnext` field is pointing to the ES6+ version with ES modules resolution;

## v4.0.10

- Refusing `is-fun` due to too big performance impact - no sense to use it with hte prop-types =\
- Refusing `is-number` for almost the same reasons;

## v4.0.9

- ESM version now has ESNext lang level;
- CJS version now has ES3 lang level;
- Now using [is-fun](https://github.com/xobotyi/is-fun) to detect callable props;

### v4.0.0-alpha.23

- Added `mobileNative` prop

### v4.0.0-alpha.21

- Fix: [#71](https://github.com/xobotyi/react-scrollbars-custom/issues/71);
- Fixed and improved sizes translation;
- Added `disableTrack*MousewheelScrolling` props;
- Prop `compensateScrollbarsWidth` inverted and renamed to `disableTracksWidthCompensation`;
- Added `disableTrackXWidthCompensation` and `disableTrackYWidthCompensation` props;

### v4.0.0-alpha.20

- Fix: [#68](https://github.com/xobotyi/react-scrollbars-custom/issues/68);
- Sizes loosing optimisation;

### v4.0.0-alpha.19

- Content element now has the minHeight & minWidth styles if content sizes translation is off (Fix: #65 );
- Vertical scrollbar now has no hard stick to any side;

### v4.0.0-alpha.18

- Fix: #63
- Fix: #48

### v4.0.0-alpha.17

- Sizes translation fixes and improvements;
- Added `compensateScrollbarsWidth` prop to be able make an overflowing scrollbars if needed.  
  Also useful when sizes translation enabled;

### v4.0.0-alpha.15

- Due to some issues with content paddings added extra wrapper element;
- Little API changes;
- Classnames changes;

> **NOTE**  
> Feel sorry fo breaking capability for the third time during the v4-alpha stage but i have to do it to name things properly.  
> Earlier some things been named not obvious and there was a little mess with classnames.  
> From now i can surely say that basic elements classnames are locked and API will be developed with maximum backward capability.  
> Sorry for any inconvenience. 🙏

### v4.0.0-alpha.14

- Component was fully reworked with power of TypeScript;
- Inner kitchen was optimised and now it is 1.5-2 times faster;
- A lot of API and semantics and classnames changes - better to treat it as a whole new component;
