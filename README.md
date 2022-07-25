<div align="center">

# react-scrollbars-custom

[![NPM Version](https://flat.badgen.net/npm/v/react-scrollbars-custom)](https://www.npmjs.com/package/react-scrollbars-custom)
[![NPM Downloads](https://flat.badgen.net/npm/dm/react-scrollbars-custom)](https://www.npmjs.com/package/react-scrollbars-custom)
[![NPM Dependents](https://flat.badgen.net/npm/dependents/react-scrollbars-custom)](https://www.npmjs.com/package/react-scrollbars-custom)
[![Build](https://img.shields.io/github/workflow/status/xobotyi/react-scrollbars-custom/CI?style=flat-square)](https://github.com/xobotyi/react-scrollbars-custom/actions)
[![Coverage](https://flat.badgen.net/codecov/c/github/xobotyi/react-scrollbars-custom)](https://app.codecov.io/gh/xobotyi/react-scrollbars-custom)
[![Types](https://flat.badgen.net/npm/types/react-scrollbars-custom)](https://www.npmjs.com/package/react-scrollbars-custom)
[![Tree Shaking](https://flat.badgen.net/bundlephobia/tree-shaking/react-scrollbars-custom)](https://bundlephobia.com/result?p=react-scrollbars-custom)

× **[DEMO](https://xobotyi.github.io/react-scrollbars-custom/)**
× **[LIVE EXAMPLE](https://codesandbox.io/s/rsc-live-example-i1zlx?module=%2Fsrc%2FRSCExample.jsx)**
× **[CHANGELOG](https://github.com/xobotyi/react-scrollbars-custom/blob/master/CHANGELOG.md)** ×

</div>

---

- Native browser scroll behavior - it don't emulate scrolling, only showing custom scrollbars,
  scrolling itself still native
- Cross-browser and cross-platform - does not matter where and how, scrollbars looks the same
  everywhere
- Ultimate performance - 60 FPS (using RAF) and highly optimised code
- No extra stylesheets required - minimum inline styles out of the box or you can style it yourself
  however you want
- Fully customizable - want a hippo as a scrollbar thumb? Well.. I don't judge you, you're free to
  do it!
- Scrollbars nesting
- Total tests coverage
- Momentum scrolling for iOS
- RTL support ([read more](#rtl-support))
- Content sizes translation ([read more](#content-sizes-translation))
- Proper page zoom handling (native scrollbars does not show up)

## INSTALLATION

```bash
npm install react-scrollbars-custom
# or via yarn
yarn add react-scrollbars-custom
```

**INSTALLATION NOTE:**  
This lib is written in ES6+ and delivering with both, transpiled and untranspiled versions:

- `main` field of `package.json` is pointing to transpiled ES3-compatible version with CJS modules
  resolution;
- `module` field is pointing to transpiled ES3-compatible version with ES modules resolution;
- `esnext` field is pointing to the ES6+ version with ES modules resolution;

Depending on your targets you may have to use [Webpack](https://webpack.js.org/) and/or
[Babel](http://babeljs.io/) to pull untranspiled version of package.  
See some tips on wiring thing
up: [https://2ality.com/2017/06/pkg-esnext.html](https://2ality.com/2017/06/pkg-esnext.html)

## USAGE

Underneath `react-scrollbars-custom` uses `requestAnimationFrame` loop, which check and update each
known scrollbar, and as result - scrollbars updates synchronised with browser's render flow.
The `<Scrollbar />` component works out of the box, with only need of `width` and `height` to be
set, inline or via CSS;

```typescript jsx
import { Scrollbar } from 'react-scrollbars-custom';

<Scrollbar style={{ width: 250, height: 250 }}>
  <p>Hello world!</p>
</Scrollbar>;
```

### Internet Explorer

`react-scrollbars-custom` is syntax-compatible with IE10, but you'll have to use polyfills - for
example [@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill).

#### Styling

Probably you'll wish to customize your scrollbars on your own way via CSS - then simply
pass `noDefaultStyles` prop - it will prevent all inline styling from appear.  
But some of styles will remain due to their need for proper component work.

#### Native mode

One more pretty common need is to disable custom scrollbars and fallback to native ones, it can be
done by passing `native` prop.
It'll change the generated markup:

```html
// scrollbar.scrollerElement
<div class="ScrollbarsCustom native trackYVisible trackXVisible">
  // scrollbar.contentElement - the one that holds tour content
  <div class="ScrollbarsCustom-Content">// YOUR CONTENT IS HERE</div>
</div>
```

As you see here - now the root element has the `scrollerElement` ref, but otherwise its treated as a
before (as holder). `contentElement` behaves as it was before.

#### Content sizes translation

In some situations you may want to make the scrollbars block of variable sizes - just
pass `translateContentSize*ToHolder` prop and component will automatically translate
corresponding `contentElement`'s sizes to the `holderElement`.  
If you are using default styles - it'll be handy to pass `disableTracksWidthCompensation` props, to
avoid infinite shrinking when it's not supposed to.  
_Note:_ This wont work for native mode.

#### RTL support

`react-scrollbars-custom` supports RTL direction out of the box, you don't have to pass extra
parameters to make it work, it'll be detected automatically on first component's render. But you
still able to override it through the prop.
There are several things you have to know about:

- Due to performance reasons direction autodetect happens is 3 cases:
  - On component mount;
  - On rtl property change;
  - On state `isRtl` set to non-boolean value;
- `rtl` property has priority over the `style` or CSS properties;
- If `rtl` prop has not been set (undefined) - direction will be detected automatically according to
  content element's CSS;
- If `rtl` prop is `true` - `direction: rtl;` style will be applied to hte content element;
- If `rtl` prop is `false` - no style will be applied to holder;

## Customization

In some cases you may want to change the default className or tagName of elements or add extra
markup or whatever. For these purposes `react-scrollbars-custom` made fully customizable.
You can do absolutely what ever you want y simply passing renderer SFC to the needed props.

> **IMPORTANT**: Renderer will receive elementRef function that expect the DOM element's reference
> as first parameter.  
> Furthermore you have to pass the styles, cause they needed to proper component work.

```typescript jsx
<Scrollbar
  renderer={(props) => {
    const { elementRef, ...restProps } = props;
    return <span {...restProps} ref={elementRef} className="MyAwesomeScrollbarsHolder" />;
  }}
  wrapperProps={{
    renderer: (props) => {
      const { elementRef, ...restProps } = props;
      return <span {...restProps} ref={elementRef} className="MyAwesomeScrollbarsWrapper" />;
    },
  }}
  scrollerProps={{
    renderer: (props) => {
      const { elementRef, ...restProps } = props;
      return <span {...restProps} ref={elementRef} className="MyAwesomeScrollbarsScroller" />;
    },
  }}
  contentProps={{
    renderer: (props) => {
      const { elementRef, ...restProps } = props;
      return <span {...restProps} ref={elementRef} className="Content" />;
    },
  }}
  trackXProps={{
    renderer: (props) => {
      const { elementRef, ...restProps } = props;
      return <span {...restProps} ref={elementRef} className="TrackX" />;
    },
  }}
  trackYProps={{
    renderer: (props) => {
      const { elementRef, ...restProps } = props;
      return <span {...restProps} ref={elementRef} className="trackY" />;
    },
  }}
  thumbXProps={{
    renderer: (props) => {
      const { elementRef, ...restProps } = props;
      return <span {...restProps} ref={elementRef} className="ThUmBX" />;
    },
  }}
  thumbYProps={{
    renderer: (props) => {
      const { elementRef, ...restProps } = props;
      return <span {...restProps} ref={elementRef} className="tHuMbY" />;
    },
  }}
/>
```

#### Generated HTML

```html
// scrollbar.holderElement
<div class="ScrollbarsCustom trackYVisible trackXVisible">
  // scrollbar.wrapperElement - the one that hiding native scrollbars
  <div class="ScrollbarsCustom-Wrapper">
    // scrollbar.scrollerElement - the one that actually has browser's scrollbars
    <div class="ScrollbarsCustom-Scroller">
      // scrollbar.contentElement - the one that holds tour content
      <div class="ScrollbarsCustom-Content">// YOUR CONTENT IS HERE</div>
    </div>
  </div>
  // scrollbar.trackYElement
  <div class="ScrollbarsCustom-Track ScrollbarsCustom-TrackY">
    // scrollbar.thumbYElement
    <div class="ScrollbarsCustom-Thumb ScrollbarsCustom-ThumbY" />
  </div>
  // scrollbar.trackXElement
  <div class="ScrollbarsCustom-Track ScrollbarsCustom-TrackX">
    // scrollbar.thumbXElement
    <div class="ScrollbarsCustom-Thumb ScrollbarsCustom-ThumbX" />
  </div>
</div>
```

- If scrolling is possible or tracks are shown die to `permanentScrollbar*` prop - `trackYVisible`
  /`trackXVisible` classnames are applied to the holder element.
- When thumb is dragged it'll have `dragging` classname.
- If direction is RTL - `rtl` classname will be added to the holder element.
- By default whole structure described above is rendered in spite of tracks visibility, but it can
  be changed by passing `removeTrackXWhenNotUsed`/`removeTrackYWhenNotUsed`
  /`removeTracksWhenNotUsed` props to the component. Respective tracks will not be rendered if it is
  unnecessary.

## API

### PROPS

You can pass any HTMLDivElement props to the component - they'll be respectfully passed to the
holder element/renderer.

**createContext** _`:boolean`_ = undefined  
Whether to create context that will contain scrollbar instance reference.

**rtl** _`:boolean`_ = undefined  
`true` - set content's direction RTL, `false` - LTR, `undefined` - autodetect according content's
style.

**native** _`:boolean`_ = undefined  
Do not use custom scrollbars, use native ones instead.

**mobileNative** _`:boolean`_ = undefined  
As `native` but enables only on mobile devices (actually when the `scrollbarWidth` is 0).

**momentum** _`:boolean`_ = true  
Whether to use momentum scrolling, suitable for iOS (will add `-webkit-overflow-scrolling: touch` to
the content element).

**noDefaultStyles** _`:boolean`_ = undefined  
Whether to use default visual styles.  
_Note:_ Styles needed to proper component work will be passed regardless of this option.

**disableTracksMousewheelScrolling** _`:boolean`_ = undefined  
Disable content scrolling while preforming a wheel event over the track.

**disableTrackXMousewheelScrolling** _`:boolean`_ = undefined  
Disable content scrolling while preforming a wheel event over the track.

**disableTrackYMousewheelScrolling** _`:boolean`_ = undefined  
Disable content scrolling while preforming a wheel event over the track.

**disableTracksWidthCompensation** _`:boolean`_ = undefined  
Disable both vertical and horizontal wrapper indents that added in order to not let tracks overlay
content.
_Note:_ Works only with default styles enabled.

**disableTrackXWidthCompensation** _`:boolean`_ = undefined  
Disable horizontal wrapper indents that added in order to not let horizontal track overlay content.
_Note:_ Works only with default styles enabled.

**disableTrackYWidthCompensation** _`:boolean`_ = undefined  
Disable vertical wrapper indents that added in order to not let vertical track overlay content.
_Note:_ Works only with default styles enabled.

**minimalThumbSize** _`:number`_ = 30  
Minimal size of both, vertical and horizontal thumbs. This option has priority
to `minimalThumbXSize`/`minimalThumbYSize` props.

**maximalThumbSize** _`:number`_ = undefined  
Maximal size of both, vertical and horizontal thumbs. This option has priority
to `maximalThumbXSize`/`maximalThumbYSize` props.

**minimalThumbXSize** _`:number`_ = undefined  
Minimal size of horizontal thumb.

**maximalThumbXSize** _`:number`_ = undefined  
Maximal size of horizontal thumb.

**minimalThumbYSize** _`:number`_ = undefined  
Minimal size of vertical thumb.

**maximalThumbYSize** _`:number`_ = undefined  
Maximal size of vertical thumb.

**noScroll** _`:boolean`_ = undefined  
Whether to disable both vertical and horizontal scrolling.

**noScrollX** _`:boolean`_ = undefined  
Whether to disable horizontal scrolling.

**noScrollY** _`:boolean`_ = undefined  
Whether to disable vertical scrolling.

**permanentTracks** _`:boolean`_ = undefined  
Whether to display both tracks regardless of scrolling ability.

**permanentTrackX** _`:boolean`_ = undefined  
Whether to display horizontal track regardless of scrolling ability.

**permanentTrackY** _`:boolean`_ = undefined  
Whether to display vertical track regardless of scrolling ability.

**removeTracksWhenNotUsed** _`:boolean`_ = undefined  
Whether to remove both vertical and horizontal tracks if scrolling is not possible/blocked and
tracks are not permanent.

**removeTrackYWhenNotUsed** _`:boolean`_ = undefined  
Whether to remove vertical track if scrolling is not possible/blocked and tracks are not permanent.

**removeTrackXWhenNotUsed** _`:boolean`_ = undefined  
Whether to remove horizontal track if scrolling is not possible/blocked and tracks are not
permanent.

**translateContentSizesToHolder** _`:boolean`_ = undefined  
Pass content's `scrollHeight` and `scrollWidth` values to the holder's `height` and `width`
styles. _Not working with `native` behavior._

**translateContentSizeYToHolder** _`:boolean`_ = undefined  
Pass content's `scrollHeight` values to the holder's `height` style. _Not working with `native`
behavior._

**translateContentSizeXToHolder** _`:boolean`_ = undefined  
Pass content's `scrollWidth` values to the holder's `width` style. _Not working with `native`
behavior._

**trackClickBehavior** _`:string`_ = "jump"  
The way scrolling behaves while user clicked the track:

- _jump_ - will cause straight scroll to the respective position.
- _step_ - will cause one screen step towards (like PageUp/PageDown) the clicked position.

**scrollbarWidth** _`:number`_ = undefined  
Scrollbar width value needed to proper native scrollbars hide. While `undefined` it is detected
automatically (once per module require).  
This prop is needed generally for testing purposes.

**fallbackScrollbarWidth** _`:number`_ = 20  
This value will be used in case of falsy `scrollbarWidth` prop. E.g. it is used for mobile devices,
because it is impossible to detect their real scrollbar width (due to their absolute positioning).

**scrollTop** _`:number`_ = undefined  
Prop that allow you to set vertical scroll.

**scrollLeft** _`:number`_ = undefined  
Prop that allow you to set horizontal scroll.

**scrollDetectionThreshold** _`:number`_ = 100  
Amount of seconds after which scrolling will be treated as completed and `scrollStop` event emitted.

**elementRef** _`:function(ref: Scrollbar)`_ = undefined  
Function that receive the scrollbar instance as 1st parameter.

**renderer** _`:SFC`_ = undefined  
SFC used to render the holder. [More about renderers usage](#customisation).

**wrapperProps** _`:object`_ = {}  
Here you can pass any props for wrapper, which is usually HTMLDivElement plus `elementRef` props
which behaves as holder's `elementRef` prop.

**contentProps** _`:object`_ = {}  
Here you can pass any props for content, which is usually HTMLDivElement plus `elementRef` props
which behaves as holder's `elementRef` prop.

**trackXProps** _`:object`_ = {}  
Here you can pass any props for trackX, which is usually HTMLDivElement plus `elementRef` props
which behaves as holder's `elementRef` prop.

**trackYProps** _`:object`_ = {}  
Here you can pass any props for trackY, which is usually HTMLDivElement plus `elementRef` props
which behaves as holder's `elementRef` prop.

**thumbXProps** _`:object`_ = {}  
Here you can pass any props for thumbX, which is usually HTMLDivElement plus `elementRef` props
which behaves as holder's `elementRef` prop.

**thumbYProps** _`:object`_ = {}  
Here you can pass any props for thumbY, which is usually HTMLDivElement plus `elementRef` props
which behaves as holder's `elementRef` prop.

**onUpdate** _`:function(scrollValues: ScrollState, prevScrollValues: ScrollState)`_ = undefined  
Function called each time any of scroll values changed and component performed an update. It is
called after component's update.

**onScroll** _`:function(scrollValues: ScrollState, prevScrollValues: ScrollState)`_ = undefined  
Function called each time scrollTop or scrollLeft has changed. It is called after component's update
and even if scrollTop/scrollLeft has been changed through the code (not by user).

**onScrollStart** _`:function(scrollValues: ScrollState)`_ = undefined  
Callback that called immediately when user started scrolling (no matter how, thumb dragging,
keyboard, mousewheel and etc.).

**onScrollStop** _`:function(scrollValues: ScrollState)`_ = undefined
Callback that called after `props.scrollDetectionThreshold` milliseconds after last scroll event.

### INSTANCE PROPERTIES

**eventEmitter** _`:Emittr`_  
Event emitter that allow you to add events handler for cases when you access Scrollbars through
context

**holderElement** _`:HTMLDivElement | null`_  
Holder DOM element reference or null if element was not rendered

**wrapperElement** _`:HTMLDivElement | null`_  
Wrapper DOM element reference or null if element was not rendered

**scrollerElement** _`:HTMLDivElement | null`_  
Scroller DOM element reference or null if element was not rendered

**contentElement** _`:HTMLDivElement | null`_  
Content DOM element reference or null if element was not rendered

**trackXElement** _`:HTMLDivElement | null`_  
Horizontal track DOM element reference or null if element was not rendered

**trackYElement** _`:HTMLDivElement | null`_  
Vertical track DOM element reference or null if element was not rendered

**thumbXElement** _`:HTMLDivElement | null`_  
Horizontal thumb DOM element reference or null if element was not rendered

**thumbYElement** _`:HTMLDivElement | null`_  
Vertical thumb DOM element reference or null if element was not rendered

(get|set) **scrollTop** _`:number`_  
Content's element scroll top

(get|set) **scrollLeft** _`:number`_  
Content's element scroll left

(get) **scrollHeight** _`:number`_  
Content's element scroll height

(get) **scrollWidth** _`:number`_  
Content's element scroll width

(get) **clientHeight** _`:number`_  
Content's element client height

(get) **clientWidth** _`:number`_  
Content's element client width

### INSTANCE METHODS

**getScrollState(force:boolean = false)** _`:plain object`_
Current scroll-related values, if `force` parameter is falsy - returns cached value which updated
with RAF loop
Returned values:

```typescript
type ScrollState = {
  /**
   * @description Content's native clientHeight parameter
   */
  clientHeight: number;
  /**
   * @description Content's native clientWidth parameter
   */
  clientWidth: number;
  /**
   * @description Content's native scrollHeight parameter
   */
  scrollHeight: number;
  /**
   * @description Content's native scrollWidth parameter
   */
  scrollWidth: number;
  /**
   * @description Content's native scrollTop parameter
   */
  scrollTop: number;
  /**
   * @description Content's native scrollLeft parameter
   */
  scrollLeft: number;
  /**
   * @description Indicates whether vertical scroll blocked via properties
   */
  scrollYBlocked: boolean;
  /**
   * @description Indicates whether horizontal scroll blocked via properties
   */
  scrollXBlocked: boolean;
  /**
   * @description Indicates whether the content overflows vertically and scrolling not blocked
   */
  scrollYPossible: boolean;
  /**
   * @description Indicates whether the content overflows horizontally and scrolling not blocked
   */
  scrollXPossible: boolean;
  /**
   * @description Indicates whether vertical track is visible
   */
  trackYVisible: boolean;
  /**
   * @description Indicates whether horizontal track is visible
   */
  trackXVisible: boolean;
  /**
   * @description Indicates whether display direction is right-to-left
   */
  isRTL?: boolean;

  /**
   * @description Pages zoom level - it affects scrollbars
   */
  zoomLevel: number;
};
```

**scrollToTop()** _`:this`_  
Scroll to the very top border of scrollable area

**scrollToLeft()** _`:this`_  
Scroll to the very left border of scrollable area

**scrollToBottom()** _`:this`_  
Scroll to the very bottom border of scrollable area

**scrollToRight()** _`:this`_  
Scroll to the very right border of scrollable area

**scrollTo(x?: number, y?: number)** _`:this`_  
Set the current scroll at given coordinates. If any value is `undefined` it'll be left as is.

**centerAt(x?: number, y?: number)** _`:this`_  
Center viewport at given coordinates. If any value is `undefined` it'll be left as is.
