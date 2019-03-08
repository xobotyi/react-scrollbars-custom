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
<div class="ScrollbarsCustom trackYVisible trackXVisible">
  // scrollbar.holderElement
  <div class="ScrollbarWrapper">
    // scrollbar.wrapperElement
    <div class="ScrollbarContent">
      // scrollbar.contentElement // YOUR CONTENT IS HERE
    </div>
  </div>
  <div class="ScrollbarTrack ScrollbarTrack-Y">
    // scrollbar.trackYElement
    <div class="ScrollbarThumb ScrollbarThumb-Y" />
    // scrollbar.thumbYElement
  </div>
  <div class="ScrollbarTrack ScrollbarTrack-X">
    // scrollbar.trackXElement
    <div class="ScrollbarThumb ScrollbarThumb-X" />
    // scrollbar.thumbXElement
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
<div class="ScrollbarsCustom native trackYVisible trackXVisible">
  // scrollbar.contentElement // YOUR CONTENT IS HERE
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

You can pass any HTMLElement props to the component - they'll be respectfully passed to the element/renderer.

**createContext** _`:boolean`_ = false

**rtl** _`:boolean`_ = undefined

**native** _`:boolean`_ = false

**momentum** _`:boolean`_ = true

**noDefaultStyles** _`:boolean`_ = false

**minimalThumbSize** _`:number`_ = 30

**maximalThumbSize** _`:number`_ = undefined

**minimalThumbXSize** _`:number`_ = undefined

**maximalThumbXSize** _`:number`_ = undefined

**minimalThumbYSize** _`:number`_ = undefined

**maximalThumbYSize** _`:number`_ = undefined

**noScrollX** _`:boolean`_ = false

**noScrollY** _`:boolean`_ = false

**noScroll** _`:boolean`_ = false

**permanentTrackX** _`:boolean`_ = false

**permanentTrackY** _`:boolean`_ = false

**permanentTracks** _`:boolean`_ = false

**removeTracksWhenNotUsed** _`:boolean`_ = false

**removeTrackYWhenNotUsed** _`:boolean`_ = false

**removeTrackXWhenNotUsed** _`:boolean`_ = false

**trackClickBehavior** _`:string`_ = "jump"

**scrollbarWidth** _`:number`_ = undefined

**fallbackScrollbarWidth** _`:number`_ = 20

**scrollTop** _`:number`_ = undefined

**scrollLeft** _`:number`_ = undefined

**elementRef** _`:function`_ = undefined

**renderer** _`:SFC`_ = undefined

**wrapperProps** _`:object`_ = {}

**contentProps** _`:object`_ = {}

**trackXProps** _`:object`_ = {}

**trackYProps** _`:object`_ = {}

**thumbXProps** _`:object`_ = {}

**thumbYProps** _`:object`_ = {}

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
