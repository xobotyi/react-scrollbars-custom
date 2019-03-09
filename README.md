<div align="center">
    <h1>react-scrollbars-custom</h1>
    <p>
        <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/badge/npm-react--scrollbars--custom-brightgreen.svg" /></a>
        <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/npm/v/react-scrollbars-custom.svg" /></a>
        <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/npm/dt/react-scrollbars-custom.svg" /></a>
        <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/travis/xobotyi/react-scrollbars-custom.svg" /></a>
        <a href="https://www.codacy.com/app/xobotyi/react-scrollbars-custom"><img src="https://api.codacy.com/project/badge/Grade/f0875490cea1497a9eca9c25f3f7774e"/></a>
        <a href="https://www.codacy.com/app/xobotyi/react-scrollbars-custom"><img src="https://api.codacy.com/project/badge/Coverage/f0875490cea1497a9eca9c25f3f7774e"/></a>
        <a href="https://www.npmjs.com/package/react-scrollbars-custom"><img src="https://img.shields.io/npm/l/react-scrollbars-custom.svg" /></a>
    </p>
    × <strong><a href="https://xobotyi.github.io/react-scrollbars-custom/">DEMO</a></strong> ×
</div>
----
  
  
- Native browser scroll behavior - it don't emulate scrolling, only showing custom scrollbars, scrolling itself still native
- Cross-browser and cross-platform - does not matter where and how, scrollbars looks the same everywhere
- Ultimate performance - 60 FPS (using RAF) and highly optimised code
- No extra stylesheets required - minimum inline styles out of the box or you can style it yourself however you want
- Fully customizable - want a hippo as a scrollbar thumb? Well.. I don't judge you, you're free to do it!
- Scrollbars nesting
- Total tests coverage
- Momentum scrolling for iOS
- RTL support ([read more](#rtl-support))

## INSTALLATION

```bash
npm install react-scrollbars-custom
# or via yarn
yarn add react-scrollbars-custom
```

## USAGE

Underneath `react-scrollbars-custom` uses `requestAnimationFrame` loop, which check and update each known scrollbar, and as result - scrollbars updates synchronised with browser's render flow.
The `<Scrollbar />` component works out of the box, with only need of `width` and `height` to be set, inline or via CSS;

```typescript jsx
<Scrollbar style={{ width: 250, height: 250 }}>
  <p>Hello world!</p>
</Scrollbar>
```

#### Generated HTML

```html
// scrollbar.holderElement
<div class="ScrollbarsCustom trackYVisible trackXVisible">
  // scrollbar.wrapperElement
  <div class="ScrollbarWrapper">
    // scrollbar.contentElement
    <div class="ScrollbarContent">
      // YOUR CONTENT IS HERE
    </div>
  </div>
  // scrollbar.trackYElement
  <div class="ScrollbarTrack ScrollbarTrack-Y">
    // scrollbar.thumbYElement
    <div class="ScrollbarThumb ScrollbarThumb-Y" />
  </div>
  // scrollbar.trackXElement
  <div class="ScrollbarTrack ScrollbarTrack-X">
    // scrollbar.thumbXElement
    <div class="ScrollbarThumb ScrollbarThumb-X" />
  </div>
</div>
```

- If scrolling is possible or tracks are shown die to `permanentScrollbar*` prop - `trackYVisible`/`trackXVisible` classnames are applied to the holder element.
- When thumb is dragged it'll have `dragging` classname.
- If direction is RTL - `rtl` classname will be added to the holder element.
- By default whole structure described above is rendered in spite of tracks visibility, but it can be changed by passing `removeTrackXWhenNotUsed`/`removeTrackYWhenNotUsed`/`removeTracksWhenNotUsed` props to the component. Respective tracks will not be rendered if it is unnecessary.

#### Default styles

Probably you'll wish to customize your scrollbars on your own way via CSS - then simply pass `noDefaultStyles` prop - it will prevent all inline styling from appear.  
But some of styles will remain due to their need for proper component work.

#### Native mode

One more pretty common need is to disable custom scrollbars and fallback to native ones, it can be done by passing `native` prop.
It'll change the generated markup:

```html
// scrollbar.contentElement
<div class="ScrollbarsCustom native trackYVisible trackXVisible">
  // YOUR CONTENT IS HERE
</div>
```

#### RTL support

`react-scrollbars-custom` supports RTL direction out of the box, you don't have to pass extra parameters to make it work, it'll be detected automatically on first component's render. But you still able to override it through the prop.
There are several things you have to know about:

- Due to performance reasons direction autodetect happens is 3 cases:
  - On component mount;
  - On rtl property change;
  - On state `isRtl` set to non-boolean value;
- `rtl` property has priority over the `style` or CSS properties;
- If `rtl` prop has not been set (undefined) - direction will be detected automatically according to content element's CSS;
- If `rtl` prop is `true` - `direction: rtl;` style will be applied to hte content element;
- If `rtl` prop is `false` - no style will be applied to holder;

## API

### PROPS

You can pass any HTMLElement props to the component - they'll be respectfully passed to the holder element/renderer.

**createContext** _`:boolean`_ = false  
Whether to create context that will contain scrollbar instance reference.

**rtl** _`:boolean`_ = undefined  
`true` - set content's direction RTL, `false` - LTR, `undefined` - autodetect according content's style.

**native** _`:boolean`_ = false  
Do not use custom scrollbars, and render the content in a single div.

**momentum** _`:boolean`_ = true  
Whether to use momentum scrolling, suitable for iOS (will add `-webkit-overflow-scrolling: touch` to the content element).

**noDefaultStyles** _`:boolean`_ = false  
Whether to use default visual styles.  
_Note:_ Styles needed to proper component work will be passed regardless of this option.

**minimalThumbSize** _`:number`_ = 30  
Minimal size of both, vertical and horizontal thumbs. This option has priority to `minimalThumbXSize`/`minimalThumbYSize` props.

**maximalThumbSize** _`:number`_ = undefined  
Maximal size of both, vertical and horizontal thumbs. This option has priority to `maximalThumbXSize`/`maximalThumbYSize` props.

**minimalThumbXSize** _`:number`_ = undefined  
Minimal size of horizontal thumb.

**maximalThumbXSize** _`:number`_ = undefined  
Maximal size of horizontal thumb.

**minimalThumbYSize** _`:number`_ = undefined  
Minimal size of vertical thumb.

**maximalThumbYSize** _`:number`_ = undefined  
Maximal size of vertical thumb.

**noScroll** _`:boolean`_ = false  
Whether to disable both vertical and horizontal scrolling.

**noScrollX** _`:boolean`_ = false  
Whether to disable horizontal scrolling.

**noScrollY** _`:boolean`_ = false  
Whether to disable vertical scrolling.

**permanentTracks** _`:boolean`_ = false  
Whether to display both tracks regardless of scrolling ability.

**permanentTrackX** _`:boolean`_ = false  
Whether to display horizontal track regardless of scrolling ability.

**permanentTrackY** _`:boolean`_ = false  
Whether to display vertical track regardless of scrolling ability.

**removeTracksWhenNotUsed** _`:boolean`_ = false  
Whether to remove both vertical and horizontal tracks if scrolling is not possible/bocked and tracks are not permanent.

**removeTrackYWhenNotUsed** _`:boolean`_ = false  
Whether to remove horizontal track if scrolling is not possible/bocked and tracks are not permanent.

**removeTrackXWhenNotUsed** _`:boolean`_ = false  
Whether to remove vertical track if scrolling is not possible/bocked and tracks are not permanent.

**trackClickBehavior** _`:string`_ = "jump"  
The way scrolling behaves while user clicked the track:

- _jump_ - will cause straight scroll to the respective position.
- _step_ - will cause one screen step towards (like PageUp/PageDown) the clicked position.

**scrollbarWidth** _`:number`_ = undefined  
Scrollbar width value needed to proper native scrollbars hide. While `undefined` it is detected automatically (once per module require).  
This prop is needed generally for testing purposes.

**fallbackScrollbarWidth** _`:number`_ = 20  
This value will be used in case of falsy `scrollbarWidth` prop. E.g. it is used for mobile devices, because it is impossible to detect their real scrollbar width (due to their absolute positioning).

**scrollTop** _`:number`_ = undefined  
Prop that allow you to set vertical scroll.

**scrollLeft** _`:number`_ = undefined  
Prop that allow you to set horizontal scroll.

**elementRef** _`:function(ref: Scrollbar)`_ = undefined  
Function that receive the scrollbar instance as 1st parameter.

**renderer** _`:SFC`_ = undefined  
SFC used to render the holder. [More about renderers usage](#customisation).

**wrapperProps** _`:object`_ = {}  
Here you can pass any props for wrapper, which is usually HTMLDivElement plus `elementRef` props which behaves as holder's `elementRef` prop.

**contentProps** _`:object`_ = {}  
Here you can pass any props for content, which is usually HTMLDivElement plus `elementRef` props which behaves as holder's `elementRef` prop.

**trackXProps** _`:object`_ = {}  
Here you can pass any props for trackX, which is usually HTMLDivElement plus `elementRef` props which behaves as holder's `elementRef` prop.

**trackYProps** _`:object`_ = {}  
Here you can pass any props for trackY, which is usually HTMLDivElement plus `elementRef` props which behaves as holder's `elementRef` prop.

**thumbXProps** _`:object`_ = {}  
Here you can pass any props for thumbX, which is usually HTMLDivElement plus `elementRef` props which behaves as holder's `elementRef` prop.

**thumbYProps** _`:object`_ = {}  
Here you can pass any props for thumbY, which is usually HTMLDivElement plus `elementRef` props which behaves as holder's `elementRef` prop.

### INSTANCE PROPERTIES

**holderElement** _`:HTMLElement | null`_

**wrapperElement** _`:HTMLElement | null`_

**contentElement** _`:HTMLElement | null`_

**trackXElement** _`:HTMLElement | null`_

**trackYElement** _`:HTMLElement | null`_

**thumbXElement** _`:HTMLElement | null`_

**thumbYElement** _`:HTMLElement | null`_

(get|set) **scrollTop** _`:number`_

(get|set) **scrollLeft** _`:number`_

(get) **scrollHeight** _`:number`_

(get) **scrollWidth** _`:number`_

(get) **clientHeight** _`:number`_

(get) **clientWidth** _`:number`_

### INSTANCE METHODS

**getScrollValues()** _`:this`_

**scrollToTop()** _`:this`_

**scrollToLeft()** _`:this`_

**scrollToBottom()** _`:this`_

**scrollToRight()** _`:this`_

**scrollTo(x?: number, y?: number)** _`:this`_

**centerAt(x?: number, y?: number)** _`:this`_

## CUSTOMISATION
